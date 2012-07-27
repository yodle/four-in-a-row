require 'c4-client'

require 'rubygems'
require 'test/unit'
require 'mocha'


class C4RubyTest < Test::Unit::TestCase
  def setup
  end

  def test_givenConnectionError_startGame_exitsGracefully
    Net::HTTP.expects(:post_form).with(any_parameters).raises(exception = RuntimeError, message = nil)

    C4Client.connect()
  end

  def test_givenConnectionFine_startGame_returnsGameResponse\
    http_mock = mock('Net::HTTPResponse')
    http_mock.stubs(
      :body => '{"gameState": "awesomeness"}'
    )

    Net::HTTP.expects(:post_form).with(any_parameters).returns(http_mock)

    assert_equal(http_mock.body, C4Client.connect())
  end


end