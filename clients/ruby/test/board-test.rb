require 'board'

require 'rubygems'
require 'test/unit'

class BoardTest < Test::Unit::TestCase
  def setup
    C4LogUtils.logger = Logger.new('/dev/null')

    # Remember, each "row" in the grid is actually a column in the board state
    @grid = [
        [0, 0, 0, 0, 0, 0], # leftmost column
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0], # right most column
      #  ^              ^
      # top           bottom
    ];
  end

  def test_givenMeIs1_initialize_correctSetsPlayers
    result = Board.new(@grid, 1);

    assert_equal(1, result.me)
    assert_equal(2, result.opp)
  end

  def test_givenMeIs2_initialize_correctSetsPlayers
    result = Board.new(@grid, 2);

    assert_equal(2, result.me)
    assert_equal(1, result.opp)
  end

  def test_givenGrid_initialize_correctlySetsBoard
    @grid = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
    ];
    b = Board.new(@grid, 2);

    for r in 0...@grid[0].length do
      for c in 0...@grid.length do
        assert_equal(@grid[c][r], b.get(c, r))
      end
    end
  end

  def test_givenSetAPosition_get_returnsWhatWasSet
    b = Board.new(@grid, 1)

    b.set(2, 2, 1)

    assert_equal(1, b.get(2, 2))
  end

  def test_givenEmptyBoard_getLegalMoves_returnsAllCols
    b = Board.new(@grid, 1)

    assert_equal((0...b.width).to_a, b.getLegalMoves())
  end

  def test_givenColumnFull_getLegalMoves_doesNotReturnThatColumn
    @grid = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [2, 1, 2, 1, 2, 1],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
    ];

    b = Board.new(@grid, 1)

    assert_equal((0...b.width).to_a - [3], b.getLegalMoves())
  end

  def test_givenFullBoard_getLegalMoves_returnsEmptyArray
    @grid = [
        [2, 1, 2, 1, 2, 1],
        [2, 1, 2, 1, 2, 1],
        [2, 1, 2, 1, 2, 1],
        [2, 1, 2, 1, 2, 1],
        [2, 1, 2, 1, 2, 1],
        [2, 1, 2, 1, 2, 1],
    ];

    b = Board.new(@grid, 1)

    assert_equal([], b.getLegalMoves())
  end

  def test_givenColumnFull_makeMove_doesNothing
    @grid = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [2, 1, 2, 1, 2, 1], # column 3
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
    ];

    expectedBoard = Board.new(@grid, 1)
    actualBoard = Board.new(@grid, 1)

    actualBoard.makeMove(3, 1)

    assert_equal(expectedBoard, actualBoard)
  end

  def test_givenColumnHasRoom_makeMove_placesPlayersPieceAtLowestInThatRow
    expectedGrid = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1], # column 3
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
    ];

    b = Board.new(@grid, 1)

    b.makeMove(3, 1)

    assert_equal(expectedGrid, b.grid)
  end

  def test_givenMoveMakesConnect4_updateWins_updatesCorrectPlayerOfWin
    @grid = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1], # column 3
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
    ];

    b = Board.new(@grid, 1)

    b.makeMove(3, 1)

    assert(b.iWin?)
  end
end