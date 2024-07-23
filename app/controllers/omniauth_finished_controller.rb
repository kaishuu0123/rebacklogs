# refs: https://qiita.com/mnishiguchi/items/e15bbef61287f84b546e
class OmniauthFinishedController < ApplicationController
  skip_authorization_check only: [:finish_signup]
  before_action :authenticate_user!, except: :finish_signup

  def finish_signup
    @user = User.find(params[:id])
    @provider = params[:provider]

    return unless (request.post? || request.patch?) && @user.update(user_params)

    # OAuth の場合には希望アカウントが入力された後にグループを作る
    @user.create_default_group
    # @user.use_gravatar_icon(false)
    # @user.send_confirmation_instructions unless @user.confirmed?
    sign_in(@user, bypass: true)
    redirect_to root_url, notice: t('devise.omniauth_callbacks.success', kind: @provider.capitalize)
  end

  private

  # user_paramsにアクセスするため。
  def user_params
    accessible = %i[username email]
    accessible << %i[password password_confirmation] unless params[:user][:password].blank?
    params.require(:user).permit(accessible)
  end
end
