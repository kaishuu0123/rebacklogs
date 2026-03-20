# Rails 8 compatible secret_key_base management.
# In production, set SECRET_KEY_BASE environment variable.
# In development/test, falls back to config/secrets.yml.
unless ENV['SECRET_KEY_BASE'].present?
  secrets_yml = Rails.root.join('config/secrets.yml')
  if File.exist?(secrets_yml)
    secrets = YAML.safe_load(ERB.new(File.read(secrets_yml)).result, permitted_classes: [], aliases: true)
    env_secrets = secrets[Rails.env.to_s] || {}
    if env_secrets['secret_key_base'].present?
      Rails.application.config.secret_key_base = env_secrets['secret_key_base']
    end
  end
end
