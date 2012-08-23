class AI
  def self.makeMove (board)
    puts board.to_s
    puts
    finalMoves = board.getLegalMoves
    finalMoves[rand(finalMoves.length)]
    3
  end
end