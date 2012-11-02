require 'c4-log-utils'
require 'logger'
require 'net/http'

require 'json'

class C4NetUtils
  def initialize(server)
    @logger = C4LogUtils.logger

    @server = server
  end

  def getGameState(path, options={})
    uri = URI.parse("http://#{@server}#{path}")
    @logger.debug("Posting to #{uri}")

    res = Net::HTTP.post_form(uri, options)

    result = JSON.parse(res.body)
    @logger.debug("Response: #{result.to_json}")
  
    return result
  end

  def server
    @server
  end
end