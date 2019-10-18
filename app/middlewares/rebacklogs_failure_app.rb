class RebacklogsFailureApp < Devise::FailureApp
  def respond
    # Set the locale from params (minimal requirement to get Devise working
    # with our current locale setup)
    I18n.locale = locale_in_accept_language || I18n.default_locale

    super
  end

  def locale_in_accept_language
    request.env['HTTP_ACCEPT_LANGUAGE']
      .to_s # nil 対策
      .split(',')
      .map{ |_| _[0..1].to_sym }
      .select { |_| I18n::available_locales.include?(_) }
      .first
  end
end