class ProjectsController < ApplicationController
  skip_authorization_check only: [:new, :create]
  load_and_authorize_resource except: [:new, :create]

  before_action :set_project, only: [
    :show, :edit, :update,
    :settings,
    :users,
    :groups, :add_group, :delete_group,
    :delete_image
  ]

  def index
  end

  def show
    @opening_sprints = @project.sprints.opening
  end

  def new
    @project = Project.new
  end

  def edit
  end

  def create
    ActiveRecord::Base.transaction do
      @project = Project.new(project_params)
      @project.save!
      @project.group_projects.create!(
        project: @project,
        group: current_user.groups.first
      )
      MasterTicketStatus.all.each do |status|
        ProjectTicketStatus.create(
          project: @project,
          title: status.title,
          sort_order: status.sort_order,
          is_done: status.is_done
        )
      end
      MasterTicketCategory.all.each do |category|
        ProjectTicketCategory.create(
          project: @project,
          title: category.title,
          sort_order: category.sort_order,
          color: category.color
        )
      end
    rescue ActiveRecord::RecordInvalid
      respond_to do |format|
        format.html { render :new }
      end
      return
    end

    redirect_to projects_path, notice: 'Project was successfully created.'
  end

  def update
    respond_to do |format|
      if @project.update(project_params)
        format.html { redirect_to projects_path, notice: 'Project was successfully updated.' }
        format.json { render :show, status: :ok, location: @project }
      else
        format.html { render :edit }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
  end

  def closed_sprints
  end

  def settings
  end

  def users
    @users = @project.users
  end

  def groups
    @groups = @project.groups
  end

  def add_group
    group = Group.find(params[:group_id])
    @project.groups << group
  end

  def delete_group
    group = @project.groups.find(params[:group_id])
    @project.groups.destroy(group)

    head :no_content
  end

  def delete_image
    @project.image.purge

    head :no_content
  end

  private

  def project_params
    params.fetch(:project, {}).permit!
  end

  def set_project
    @project = Project.find(params[:id])
  end
end
