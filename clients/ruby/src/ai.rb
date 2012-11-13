require 'c4-log-utils'

class AI
  def initialize() 
    @logger = C4LogUtils.logger
  end

  def makeMove (board)
    @logger.info(board.to_s)

    finalMoves = board.getLegalMoves
    finalMoves[rand(finalMoves.length)]
    3
  end
end