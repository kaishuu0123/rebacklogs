source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.5.3'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
# Full-stack web application framework. (https://rubyonrails.org)
gem 'rails', '~> 6.0.0'
# Use Puma as the app server
# Puma is a simple, fast, threaded, and highly concurrent HTTP 1.1 server for Ruby/Rack applications (http://puma.io)
gem 'puma', '~> 3.12'
# Use SCSS for stylesheets
# Sass adapter for the Rails asset pipeline. (https://github.com/rails/sass-rails)
gem 'sass-rails', '~> 5'
# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
# Use webpack to manage app-like JavaScript modules in Rails (https://github.com/rails/webpacker)
gem 'webpacker', '~> 4.0'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
# Create JSON structures via a Builder-style DSL (https://github.com/rails/jbuilder)
gem 'jbuilder', '~> 2.7'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Active Storage variant
# gem 'image_processing', '~> 1.2'

# Reduces boot times through caching; required in config/boot.rb
# Boot large ruby/rails apps faster (https://github.com/Shopify/bootsnap)
gem 'bootsnap', '>= 1.4.2', require: false

group :development, :test do
  # Use sqlite3 as the database for Active Record
  # This module allows Ruby programs to interface with the SQLite3 database engine (http://www.sqlite.org) (https://github.com/sparklemotion/sqlite3-ruby)
  gem 'sqlite3', '~> 1.4'

  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  # Ruby fast debugger - base + CLI (https://github.com/deivid-rodriguez/byebug)
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  # A debugging tool for your Ruby on Rails applications. (https://github.com/rails/web-console)
  gem 'web-console', '>= 3.3.0'
  # Listen to file modifications (https://github.com/guard/listen)
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  # Rails application preloader (https://github.com/rails/spring)
  gem 'spring'
  # Makes spring watch files using the listen gem. (https://github.com/jonleighton/spring-watcher-listen)
  gem 'spring-watcher-listen', '~> 2.0.0'
  # Solargraph for Ruby (http://solargraph.org)
  gem 'solargraph'
  # Automatic Ruby code style checking tool. (https://github.com/rubocop-hq/rubocop)
  gem 'rubocop'
  # An IRB alternative and runtime developer console (http://pryrepl.org)
  gem 'pry'

  # Add comments to your Gemfile with each dependency's description. (https://github.com/ivantsepp/annotate_gem)
  gem 'annotate_gem', require: false
  # Annotates Rails Models, routes, fixtures, and others based on the database schema. (http://github.com/ctran/annotate_models)
  gem 'annotate', require: false

  # Preview email in the default browser instead of sending it.
  gem 'letter_opener_web'
end

group :production do
  # Pg is the Ruby interface to the {PostgreSQL RDBMS}[http://www.postgresql.org/] (https://bitbucket.org/ged/ruby-pg)
  gem 'pg', '~> 1.1'
end

group :test do
  # Adds support for Capybara system testing and selenium driver
  # Capybara aims to simplify the process of integration testing Rack applications, such as Rails, Sinatra or Merb (https://github.com/teamcapybara/capybara)
  gem 'capybara', '>= 2.15'
  # The next generation developer focused tool for automated testing of webapps (https://github.com/SeleniumHQ/selenium)
  gem 'selenium-webdriver'
  # Easy installation and use of web drivers to run system tests with browsers
  # Easy download and use of browser drivers. (https://github.com/titusfortner/webdrivers)
  gem 'webdrivers'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
# Timezone Data for TZInfo (http://tzinfo.github.io)
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# Flexible authentication solution for Rails with Warden (https://github.com/plataformatec/devise)
gem 'devise'
# Translations for the devise gem (http://github.com/tigrish/devise-i18n)
gem 'devise-i18n'
# A simple github-like identicons generator. (http://github.com/victorgama/identicon)
gem 'identicon'
# Create Gmail like text avatars. (https://github.com/aki77/initial_avatar)
gem 'initial_avatar'
# Generate scoped sequential IDs for ActiveRecord models (https://github.com/djreimer/sequenced)
gem 'sequenced'
# An acts_as_sortable replacement built for Rails 3 & 4 (https://github.com/mixonic/ranked-model)
gem 'ranked-model', '~> 0.4'
# Track changes to your models. (https://github.com/paper-trail-gem/paper_trail)
gem 'paper_trail', '~> 10.3.0'
# Common locale data and translations for Rails i18n. (http://github.com/svenfuchs/rails-i18n)
gem 'rails-i18n', '~> 6.0.0' # For 6.0.0 or higher
# Forms made easy! (https://github.com/plataformatec/simple_form)
gem 'simple_form'

# Roles library with resource scoping (https://github.com/RolifyCommunity/rolify)
gem 'rolify'
# Simple authorization solution for Rails. (https://github.com/CanCanCommunity/cancancan)
gem 'cancancan'

# Settings plugin for Rails that makes managing a table of global keys. (https://github.com/huacnlee/rails-settings-cached)
gem 'rails-settings-cached', '~> 2.0'

gem 'omniauth', '~> 1.9'
gem 'omniauth-twitter', '~> 1.4'
gem 'omniauth-github', '~> 1.3'
gem 'omniauth-google-oauth2', '~> 0.8'

gem 'config'

gem 'kaminari', '~> 1.1'

