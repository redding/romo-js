require "sinatra/base"

class TestsServer < Sinatra::Base
  run! if app_file == $0
end
