require 'c4-log-utils'
require 'c4-net-utils'
require 'ai'
require 'board'

class C4Client
  def initialize (options)
    @logger = C4LogUtils.logger

    @netUtils = C4NetUtils.new(options[:server])
    @ai = AI.new()

    @level = options[:level]
    @nickname = options[:nickname]
    @server = options[:server]
  end

  def start()
    game = connect();
    if (!!game)
      self.playGame(game);
    end
  end

  def game_host
    return @server
  end

  def netUtils=(utils)
    @netUtils = utils
  end

  def ai=(ai)
    @ai = ai
  end


  def playGame(game)
    while (game['gameOver'] == 0)
      game = self.makeMove(game);
    end

    if (not game['board'].nil?)
      board = Board.new(game['board'], '1')
      @logger.info('Final State:')
      @logger.info(board)
    else
      @logger.error(game['error'])
    end
  end

  def makeMove(game)
    gameId = game['id']
    board = Board.new(game['board'], game['humanPlayer'])

    move = @ai.makeMove(board)
    @logger.info("Making move in column #{move}")
    game = @netUtils.getGameState("/game/move/#{gameId}", {:move => move})

    error = game['error'];
    if (not error.nil?)
      @logger.error(error)
    end

    return game
  end

  def connect
    @logger.info("Starting game.")
    @logger.info("Connecting to server...")

    result = @netUtils.getGameState("/game/init/#{@level}", {:nickname => @nickname})    

    @logger.info('Connected to server.')
    return result
  end
end
