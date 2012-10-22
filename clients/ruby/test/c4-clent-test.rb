require 'c4-client'

require 'test/unit'
require 'mocha'

class C4ClientTest < Test::Unit::TestCase
  @client

  @netUtils
  @ai

  # mocked dependencies
  def setup
    @netUtils = C4NetUtils.new()
    @ai = AI.new()

    @client = C4Client.new()
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

  def test_givenLevel_startGame_postsWithLevel
    @netUtils.stubs(:getGameState).with('/game/init/1', anything).returns(@game)

    assert_not_nil(@client.connect(1, 'nickname'))
  end

  def test_givenNickname_startGame_postsWithNickname
    @netUtils.stubs(:getGameState).with(anything, {:nickname => 'nickname'}).returns(@game)

    assert_not_nil(@client.connect(1, 'nickname'))
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