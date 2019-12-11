require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module ReBacklogs
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0

    config.paths.add File.join('app', 'helpers'), glob: File.join('**', '*.rb')
    config.autoload_paths += Dir[Rails.root.join('app', 'helpers', '*')]

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.
    config.i18n.available_locales = %i[ja en]
    config.i18n.enforce_available_locales = true
    config.i18n.default_locale = :en
  end
end
