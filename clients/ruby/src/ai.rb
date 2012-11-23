require 'c4-log-utils'

class AI
  def initialize() 
    @logger = C4LogUtils.logger
  end

  def makeMove (board)
    @logger.info(board.to_s)

    # write your code here!

    finalMoves = board.getLegalMoves
    finalMoves[rand(finalMoves.length)]
  end
end