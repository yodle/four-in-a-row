require 'c4-test-harness'
require 'board'

require 'rubygems'
require 'test/unit'

class BoardTest < C4TestHarness
  def setup

    @grid = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ];
  end

  def test_givenMe_initialize_correctSetsMe
    result = Board.new(@grid, 1);

    assert_equal(1, result.me)
  end
end