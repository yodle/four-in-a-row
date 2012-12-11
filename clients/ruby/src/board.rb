class Board
  attr_reader   :grid
  attr_accessor :width, :height, :me, :opp

  def initialize(board, me)
    @width = board.length;
    @height = board[0].length;
    @grid = board;

    @me = me;
    @opp = (me % 2) + 1;
  end
  
  def set(col, row, player)
    @grid[col][row] = player;
  end
  
  def get(col, row)
    @grid[col][row];
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
  end

  def == (other)
    @grid == other.grid
  end

  def to_s 
    s = '';
    for r in 0...@height do
      for c in 0...@width do
        tile = @grid[c][r]
        
        if tile == 0 
          t = ' '
        else
          t = Board.player_to_s(tile)
        end

        s += "[#{t}]";
      end
      s += "\n";
    end
    s
  end

  def self.player_to_s(player)
    if player == 1
      '1'
    elsif player == 2
      '2'
    end
  end

private

end