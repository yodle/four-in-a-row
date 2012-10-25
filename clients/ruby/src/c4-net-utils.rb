require 'net/http'

require 'json'

class C4NetUtils
  @@GAME_HOST = 'challenge.yodle.com:3000'

  def getGameState(path, options={})
    uri = URI.parse("http://#{@@GAME_HOST}#{path}")

    res = Net::HTTP.post_form(uri, options)
  
    return JSON.parse(res.body)
  end
end