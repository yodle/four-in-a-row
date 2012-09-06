require 'net/http'

require 'ai'
require 'board'

require 'rubygems'
require 'json'
require 'pp'

class C4Client
  def self.start
    game = JSON.parse(self.connect());
    gameId = game['_id']    
    while (not game['gameOver'])
      board = Board.new(game['board'])
      
      move = AI.makeMove(board)
      begin
        uri = URI.parse("http://localhost:3000/game/move/#{gameId}")
        res = Net::HTTP.post_form(uri, 'move' => move)
        game = JSON.parse(res.body)
        error = game['error'];
        if (not error.nil?)
          puts error
        end
      rescue Exception => e
        puts 'There was an error connecting to the server: '
        puts e.message
        return
      end
    end
    board = Board.new(game['board'])
    puts board
  end

private
  def self.connect
    begin
      uri = URI.parse('http://localhost:3000/game/init/3')
      res = Net::HTTP.post_form(uri, 'nickname' => 'peterpeterpumpkineater', 'scaffold' => 'ruby')
      res.body
    rescue Exception => e
      puts 'There was an error connecting to the server: '
      puts e.message
    end
  end
end
