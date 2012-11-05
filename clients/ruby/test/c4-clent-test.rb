require 'c4-client'

require 'c4-test-harness'
require 'test/unit'
require 'mocha'

class C4ClientTest < C4TestHarness
  @client

  @netUtils
  @ai

  # mocked dependencies
  def setup
    @options = {
      :level => 1, 
      :nickname => 'nickname',
      :server => 'challenge.yodle.com:3000'
    }

    @netUtils = C4NetUtils.new(@options[:server])
    @ai = AI.new()

    @client = C4Client.new(@options)
    @client.netUtils = @netUtils
    @client.ai = @ai;

    @game = JSON.parse({
      :id => '230f329jf3',
      :gameOver => false,
      :board => [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ]
    }.to_json)
  end

  def test_givenServer_initialize_setsUpNetUtilsCorrectly

  end

  def test_givenLevel_startGame_postsWithLevel
    @netUtils.stubs(:getGameState).with('/game/init/1', anything).returns(@game)

    assert_not_nil(@client.connect())
  end

  def test_givenNickname_startGame_postsWithNickname
    @netUtils.stubs(:getGameState).with(anything, {:nickname => 'nickname'}).returns(@game)

    assert_not_nil(@client.connect())
  end

  def test_givenGameId_makeMove_postsWithCorrectId
    @netUtils.stubs(:getGameState).with("/game/move/#{@game['id']}", anything).returns(@game)

    @client.makeMove(@game)
  end

  def test_givenAI_makeMove_postsWithCorrectMove
    @ai.stubs(:makeMove).with(any_parameters).returns(3)
    @netUtils.stubs(:getGameState).with(anything, {:move => 3}).returns(@game)

    @client.makeMove(@game)
  end


end