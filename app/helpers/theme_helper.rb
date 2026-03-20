module ThemeHelper
  PRESETS_PATH = Rails.root.join('config', 'theme_presets.json').freeze

  def self.presets
    @presets ||= JSON.parse(File.read(PRESETS_PATH))
  end

  def self.theme_names
    presets.keys
  end

  def self.css_variables_for(theme_name)
    return nil if theme_name.blank?
    preset = presets[theme_name]
    return nil unless preset

    vars = preset['light']
    vars.map { |key, value| "--#{key}: #{value};" }.join(' ')
  end

  # Returns an inline <style> tag injecting the selected theme CSS variables.
  # Always rendered so Turbo Drive can replace it by id on navigation.
  def theme_style_tag
    vars = ThemeHelper.css_variables_for(Setting.theme_name.presence)
    content = vars ? ":root { #{vars} }" : ""
    "<style id=\"app-theme\">#{content}</style>".html_safe
  end
end
