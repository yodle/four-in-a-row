require 'c4-net-utils'

require 'ai'
require 'board'

class C4Client
  @@GAME_HOST = 'challenge.yodle.com:3000'
  
  @netUtils = C4NetUtils.new()
  @ai = AI.new()

  def start(level, nickname)
    game = self.connect(level, nickname);
    if (!!game)
      self.playGame(game);
    end
  end

  def game_host
    return @@GAME_HOST
  end

  def netUtils=utils
    @netUtils = utils
  end

  def ai=ai
    @ai = ai
  end


  def playGame(game)
    p game
    while (game['gameOver'] == 0)
      game = self.makeMove(game);
    end

    if (not game['board'].nil?)
      board = Board.new(game['board'], '1')
      puts 'Final State:'
      puts board
    else
      puts game['error']
    end
  end

  def makeMove(game)
    gameId = game['id']
    board = Board.new(game['board'], game['humanPlayer'])

    move = @ai.makeMove(board)
    puts "Making move in column #{move}"
    game = @netUtils.getGameState("/game/move/#{gameId}", {:move => move})

    p game

    error = game['error'];
    if (not error.nil?)
      puts error
    end

    return game
  end

  def connect(level, nickname)
    uriString = "http://#{@@GAME_HOST}/game/init/#{level}";
    puts "Connecting to #{uriString} ..."

    result = @netUtils.getGameState("/game/init/#{level}", {:nickname => nickname})    

    puts 'Connected to server.'
    return result
  end
end
