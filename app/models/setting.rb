# == Schema Information
#
# Table name: settings
#
#  id         :integer          not null, primary key
#  var        :string           not null
#  value      :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

# RailsSettings Model
class Setting < RailsSettings::Base
  cache_prefix { 'v2' }

  # Define your fields
  # field :host, type: :string, default: "http://localhost:3000"
  # field :default_locale, default: "en", type: :string
  # field :confirmable_enable, default: "0", type: :boolean
  # field :admin_emails, default: "admin@rubyonrails.org", type: :array
  # field :omniauth_google_client_id, default: (ENV["OMNIAUTH_GOOGLE_CLIENT_ID"] || ""), type: :string, readonly: true
  # field :omniauth_google_client_secret, default: (ENV["OMNIAUTH_GOOGLE_CLIENT_SECRET"] || ""), type: :string, readonly: true

  field :installed, type: :boolean, default: false

  field :site_title, type: :string, default: ''

  field :head_custom_script, type: :string, default: ''
  field :body_custom_script, type: :string, default: ''
end
