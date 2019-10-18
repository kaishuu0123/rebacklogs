class ApplicationSettings::UserManagementsController < ApplicationController
  authorize_resource class: false
  before_action :set_user, only: [
    :show, :update, :edit, :destroy,
    :update_role, :destroy_image
  ]

  def index
    @users = User.all
  end

  def edit
  end

  def update
    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to edit_application_settings_user_management_path(@user), notice: 'User was successfully created.' }
        format.json { render :show, status: :ok, location: @user }
      else
        format.html { render :edit }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @user.destroy

    respond_to do |format|
      format.html { redirect_to application_settings_user_managements_path, notice: 'User was successfully destroyed.' }
      format.json { render :show, status: :ok, location: @user }
    end
  end

  def update_role
    unless Role::ALL_ROLES.include?(user_params[:role].to_sym)
      redirect_to edit_application_settings_user_management_path(@user), notice: 'User was successfully updated.'
    end

    # remove all role
    roles = @user.roles.map(&:name)
    roles.each { |role_name| @user.remove_role(role_name) }

    @user.add_role(user_params[:role])

    respond_to do |format|
      format.html { redirect_to edit_application_settings_user_management_path(@user), alert: 'Role not Found' }
      format.json { render :show, status: :ok, location: @user }
    end
  end

  def destroy_image
    @user.image.purge

    redirect_to edit_application_settings_user_management_path(@user), notice: 'User was successfully updated.'
  end

  private
  def user_params
    params.require(:user).permit(:username, :email, :image, :role)
  end

  def set_user
    @user = User.find(params[:id])
  end
end