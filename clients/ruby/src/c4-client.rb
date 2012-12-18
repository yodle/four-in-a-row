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
    @turn = 1
    @challengePlayer = game['challengerPlayer'];
    while (game['gameOver'] == 0)
      log_turn
      game = self.makeMove(game);

      @turn += 1
    end

    if (not game['board'].nil?)
      log_turn
      board = Board.new(game['board'], game['challengerPlayer'])
      @logger.info(game['message']) 
      log_board(board)
    else
      @logger.error(game['error'])
    end
  end

  def makeMove(game)
    gameId = game['id']
    board = Board.new(game['board'], @challengePlayer)
    log_board(board)

    move = @ai.makeMove(board)
    @logger.info("Turn #{@turn}: making move in column #{move}\n")
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

private
  def log_board(board)
    board.to_s.split("\n").each do |s| @logger.info(s) end
  end

  def log_turn
    @logger.info("-- Turn: #{@turn}, you are player #{@challengePlayer} --")
    #@logger.info("-- Turn: #{@turn} You are [#{Board.player_to_s(@challengePlayer)}] --")
  end
end
