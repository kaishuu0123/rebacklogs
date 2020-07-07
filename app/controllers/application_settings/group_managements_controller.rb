class ApplicationSettings::GroupManagementsController < ApplicationController
  authorize_resource class: false

  before_action :set_group, only: [
    :show, :edit, :update, :destroy, :add_user, :remove_user
  ]

  GROUP_PER_PAGE = 25

  def index
    @groups = Group.page(params[:page]).per(GROUP_PER_PAGE)

    @group = Group.new
  end

  def show
    @addable_users = User.where.not(id: @group.users)
  end

  def new
    @group = Group.new
  end

  def create
    @groups = Group.all

    @group = Group.new(group_params)

    respond_to do |format|
      if @group.save
        format.html { redirect_to application_settings_group_managements_path, notice: 'Group was successfully created.' }
        format.json { render :show, status: :ok, location: @group }
      else
        format.html { render :index }
        format.json { render json: @group.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
  end

  def destroy
    @group.destroy

    respond_to do |format|
      format.html { redirect_to application_settings_group_managements_path, notice: 'Group was successfully destroyed.' }
      format.json { render :show, status: :ok, location: @group }
    end
  end

  def add_user
    user = User.find_by(id: group_params[:user_id])
    if user.present?
      @group.users << user

      respond_to do |format|
        format.html { redirect_to application_settings_group_management_path(@group), notice: 'Group was successfully updated.' }
        format.json { render :show, status: :ok, location: @group }
      end
    else
      @addable_users = User.where.not(id: @group.users)
      render :show
    end
  end

  def remove_user
    @group.users.destroy(User.find(params[:user_id]))

    respond_to do |format|
      format.html { redirect_to application_settings_group_management_path(@group), notice: 'Group was successfully updated.' }
      format.json { render :show, status: :ok, location: @group }
    end
  end

  private
  def group_params
    params.require(:group).permit(:name, :user_id)
  end

  def set_group
    @group = Group.find(params[:id])
  end
end
