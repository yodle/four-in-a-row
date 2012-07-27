require 'net/http'

class C4Client
  def self.connect
    begin
      uri = URI.parse('http://localhost:3000/game/init/1')
      res = Net::HTTP.post_form(uri, 'nickname' => 'peterpeterpumpkineater')
      puts res.body
      res.body
    rescue Exception => e
      puts 'There was an error connecting to the server: '
      puts e.message
    end
  end
end