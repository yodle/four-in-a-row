require 'test/unit'

class C4TestHarness < Test::Unit::TestCase
  @logger

  def setup
    C4LogUtils.logger = Logger.new('/dev/null')
    @logger = logger
  end

  def test_dummy
  end
end