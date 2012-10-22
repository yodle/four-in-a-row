require 'rake/testtask'

Rake::TestTask.new do |t|
  t.libs << "src:test"
  t.test_files = FileList['test/*-test.rb']
  t.verbose = true
  t.ruby_opts << '-rubygems'
end