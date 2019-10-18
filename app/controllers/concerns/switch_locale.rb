module SwitchLocale
  extend ActiveSupport::Concern

  # refs: https://github.com/rails/rails/issues/34043
  def switch_locale(&action)
    locale = locale_in_params || locale_in_accept_language || I18n.default_locale
    I18n.with_locale(locale, &action)
  end

  # params の locale の値（優先すべき）
  # @return [Symbol]
  #   params から取った locale
  #   有効な値でなければ :en
  #   取得できなかった場合 nil
  def locale_in_params
    if params[:locale].present?
      params[:locale].to_sym.presence_in(I18n::available_locales) || I18n.default_locale
    else
      nil
    end
  end

  # 環境変数 HTTP_ACCEPT_LANGUAGE を順に検証し、最初に一致した有効な locale を返す
  # @return [Symbol]  環境変数 HTTP_ACCEPT_LANGUAGE から取った locale 。取得できなかった場合 nil
  def locale_in_accept_language
    request.env['HTTP_ACCEPT_LANGUAGE']
      .to_s # nil 対策
      .split(',')
      .map{ |_| _[0..1].to_sym }
      .select { |_| I18n::available_locales.include?(_) }
      .first
  end
end