require 'c4-client'
require 'optparse'

options = {
  :level => 1, 
  :nickname => 'challenger'
}

OptionParser.new do |opts|
  opts.banner = "Usage: c4-start.rb [options]"

  opts.on("-l N", "Choose which level of AI to play against. Default=1") do |n|
    options[:level] = n
  end

  opts.on("-n NICKNAME", "Choose which level of AI to play against. Defaul=challenger") do |name|
    options[:nickname] = name
  end
end.parse!

C4Client.start(options[:level], options[:nickname])