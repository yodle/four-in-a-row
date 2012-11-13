require 'c4-client'
require 'c4-log-utils'
require 'optparse'
require 'logger'

options = {
  :level => 1, 
  :nickname => 'challenger',
  :server => 'challenge.yodle.com:3000',
  :verbose => false
}

OptionParser.new do |opts|
  opts.banner = "Usage: start-game [options]"

  opts.on("-l", "--level N", "Choose which level of AI to play against.", "Default: 1") do |n|
    options[:level] = n
  end

  opts.on("-n", "--nickname NICNAME", "This is your nickname. It will be used for high scores.", "Default: 'challenger'") do |name|
    options[:nickname] = name
  end

  opts.on("-s", "--server SERVER", "This is the server to connect to.", "Default: challenge.yodle.com:3000") do |server|
    options[:server] = server
  end

  opts.on("-v", "--[no-]verbose", "Verbose mode. See all debug messages.", "Default: false") do |v|
    options[:verbose] = v
  end
end.parse!

logger = Logger.new(STDOUT)
logger.level = options[:verbose] ? Logger::DEBUG : Logger::INFO
logger.formatter = proc do |severity, datetime, progname, msg|
  "[#{datetime.strftime('%Y-%m-%d %H:%M:%S')} #{severity}]: #{msg}\n"
end

C4LogUtils.logger = logger


client = C4Client.new(options);
client.start()