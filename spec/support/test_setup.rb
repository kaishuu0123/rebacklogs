RSpec.configure do |config|
  config.before(:each) do
    Setting.installed = true
  end
end
