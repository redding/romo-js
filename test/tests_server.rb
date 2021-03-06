require "pry"
require "sinatra/base"

class TestsServer < Sinatra::Base
  # API - Romo.xhr

  get "/api/xhr/info.json" do
    { propertyName: "property-value" }.merge(params).to_json
  end

  get "/api/xhr/error.json" do
    raise "error"
  end

  # UI - Form tests

  get "/ui/forms/info.json" do
    params.to_h.to_json
  end

  post "/ui/forms/resource" do
    params.to_h.to_json
  end

  put "/ui/forms/resource-422" do
    halt 422, { field_name: ["can't be blank"] }.to_json
  end

  # UI - XHR tests

  get "/ui/xhr/info.json" do
    { propertyName: "property-value" }.merge(params).to_json
  end

  get "/ui/xhr/aborted.json" do
    sleep 1
    { propertyName: "property-value" }.merge(params).to_json
  end

  post "/ui/xhr/resource" do
    params.to_h.to_json
  end

  # Configuration

  run! if app_file == $0
end
