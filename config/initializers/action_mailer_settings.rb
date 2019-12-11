unless ReBacklogs::Application.config.action_mailer.nil?
  options = YAML.load_file(Rails.root.join('config', 'mailer.yml'))[Rails.env]
  ReBacklogs::Application.config.action_mailer.merge! options.deep_symbolize_keys! unless options.nil?
end