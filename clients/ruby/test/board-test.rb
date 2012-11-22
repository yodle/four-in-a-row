require 'board'

require 'rubygems'
require 'test/unit'

class BoardTest < Test::Unit::TestCase
  def setup
    C4LogUtils.logger = Logger.new('/dev/null')

    @grid = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ];
  end

  def test_givenMeIs1_initialize_correctSetsPlayers
    result = Board.new(@grid, 1);

    assert_equal(1, result.me)
    assert_equal(2, result.opponent)
  end

  def test_givenMeIs2_initialize_correctSetsPlayers
    result = Board.new(@grid, 2);

    assert_equal(2, result.me)
    assert_equal(1, result.opponent)
  end
end