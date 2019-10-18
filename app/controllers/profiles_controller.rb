class ProfilesController < ApplicationController
  authorize_resource :user

  def index
  end

  def update
    respond_to do |format|
      if current_user.update(user_params)
        format.html { redirect_to profiles_path, notice: 'Profile was successfully updated.' }
      else
        format.html { render :edit }
      end
    end
  end

  def update_password
    respond_to do |format|
      if current_user.update_with_password(user_params)
        # パスワードを変更するとログアウトしてしまうので、再ログインが必要
        sign_in(current_user, bypass: true)
        format.html { redirect_to profiles_path, notice: 'Password was successfully updated.' }
      else
        format.html { render :index }
      end
    end
  end

  def destroy_image
    current_user.image.purge

    redirect_to profiles_path, notice: 'Profile was successfully updated.'
  end

  private
  def user_params
    params.fetch(
      :user, {}
    ).permit!
  end
end
