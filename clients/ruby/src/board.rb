class Board
  def initialize(board, me)
    @width = board.length;
    @height = board[0].length;
    @grid = board;

    @me = 1;
    @opp = 2;
  end
  
  def width
    @width
  end
  
  def height
    @height
  end
  
  def set(col, row, player)
    @grid[col][row] = player;
  end
  
  def get(col, row)
    @grid[col][row];
  end
  
  def iWin?
    @iWin
  end
  
  def oppWins?
    @oppWins
  end

  def getLegalMoves
    result = [];
    for col in 0...@width do
      if @grid[col][0] == 0
        result << col;
      end
    end
    result;
  end
  
  def makeMove(move, player)
    rowStopped = 0;
    (@height - 1).downto(0) do |row|
      if @grid[move][row] == 0
        @grid[move][row] = player;
        rowStopped = row;
        break;
      end
    end

    @iWin = updateWins(move, rowStopped, @me);
    @oppWins = updateWins(move, rowStopped, @opp);
    if @iWin or @oppWins
      return;
    end
  end

  def to_s 
    s = "\n";
    for r in 0...@height do
      for c in 0...@width do
        s += @grid[c][r].to_s + ' ';
      end
      s += "\n";
    end
    s
  end
end