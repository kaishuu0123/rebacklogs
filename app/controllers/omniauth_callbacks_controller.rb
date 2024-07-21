# refs: https://qiita.com/mnishiguchi/items/e15bbef61287f84b546e
class OmniauthCallbacksController < Devise::OmniauthCallbacksController
  # いくつプロバイダーを利用しようが処理は共通しているので本メソッドをエイリアスとして流用。
  def callback_for_all_providers
    unless request.env['omniauth.auth'].present?
      flash[:danger] = 'Authentication data was not provided'
      redirect_to root_url && return
    end
    provider = __callee__.to_s
    user = OAuthService::GetOAuthUser.call(request.env['omniauth.auth'])
    # ユーザーがデータベースに保存されており、且つemailを確認済みであれば、ユーザーをログインする。
    if user.persisted? && user.email_verified?
      sign_in_and_redirect user, event: :authentication
      set_flash_message(:notice, :success, kind: provider.capitalize) if is_navigational_format?
    else
      # user.reset_confirmation!
      flash[:warning] = t('.need_info_before_signup', default: 'We need your email address before proceeding.')
      redirect_to finish_signup_path(user, provider: provider)
    end
  end

  alias github callback_for_all_providers
  alias google_oauth2 callback_for_all_providers
end
