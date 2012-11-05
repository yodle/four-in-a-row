require 'c4-net-utils'
require 'c4-log-utils'
require 'c4-test-harness'

require 'rubygems'
require 'test/unit'

require 'mocha'

class C4NetUtilsTest < C4TestHarness
  @http_mock

  @netUtils
  def setup

    @server = 'this.server.com'
    @netUtils = C4NetUtils.new(@server)

    @http_mock = mock('Net::HTTPResponse')
    @http_mock.stubs(
      :body => {:id => '23423f23f23'}.to_json
    )
  end

  def test_givenConnectionFine_startGame_returnsResponseAsJSON
    Net::HTTP.expects(:post_form).with(any_parameters).returns(@http_mock)

    assert_equal(JSON.parse(@http_mock.body), @netUtils.getGameState('/'))

  end
end