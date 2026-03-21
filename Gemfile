source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '>= 3.3', '< 4'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
# Full-stack web application framework. (https://rubyonrails.org)
gem 'rails', '~> 8.0.0'
# Use Puma as the app server
# Puma is a simple, fast, threaded, and highly concurrent HTTP 1.1 server for Ruby/Rack applications (http://puma.io)
gem 'puma', '>= 5.0'
# Use SCSS for stylesheets
# Sass adapter for the Rails asset pipeline. (https://github.com/rails/sass-rails)
gem 'sass-rails', '~> 5'
gem 'vite_rails', '~> 3.0'
gem 'turbo-mount'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
# Create JSON structures via a Builder-style DSL (https://github.com/rails/jbuilder)
gem 'jbuilder'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Active Storage variant
# gem 'image_processing', '~> 1.2'

# Reduces boot times through caching; required in config/boot.rb
# Boot large ruby/rails apps faster (https://github.com/Shopify/bootsnap)
# gem 'bootsnap', '>= 1.4.2', require: false

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  # Ruby fast debugger - base + CLI (https://github.com/deivid-rodriguez/byebug)
  gem 'byebug', platforms: %i[mri windows]
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  # A debugging tool for your Ruby on Rails applications. (https://github.com/rails/web-console)
  gem 'web-console'
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

group :development, :test do
  gem 'rspec-rails', '~> 8.0'
  gem 'rspec-request_describer'
  gem 'database_cleaner'
  gem 'factory_bot_rails'
  gem 'faker'
  gem 'shoulda-matchers', '~> 7.0'
  gem 'rubocop', require: false
  gem 'rubocop-performance', require: false
  gem 'rubocop-rails', require: false
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
# Timezone Data for TZInfo (http://tzinfo.github.io)
gem 'tzinfo-data', platforms: %i[windows jruby]

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
gem 'paper_trail', '~> 17.0'
# Common locale data and translations for Rails i18n. (http://github.com/svenfuchs/rails-i18n)
gem 'rails-i18n', '~> 8.0'
# Forms made easy! (https://github.com/plataformatec/simple_form)
gem 'simple_form'

# Roles library with resource scoping (https://github.com/RolifyCommunity/rolify)
gem 'rolify'
# Simple authorization solution for Rails. (https://github.com/CanCanCommunity/cancancan)
gem 'cancancan'

# Settings plugin for Rails that makes managing a table of global keys. (https://github.com/huacnlee/rails-settings-cached)
gem 'rails-settings-cached', '~> 2.0'

gem 'omniauth', '~> 2.1'
gem 'omniauth-rails_csrf_protection'
gem 'omniauth-github', '~> 2.0'
gem 'omniauth-google-oauth2', '~> 1.2'

gem 'config'

gem 'gravatar_image_tag'
gem 'kaminari', '~> 1.2'
