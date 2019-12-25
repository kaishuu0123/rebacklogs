class ProjectsController < ApplicationController
  skip_authorization_check only: [:new, :create]
  load_and_authorize_resource except: [:new, :create]

  before_action :set_project, only: [
    :show, :edit, :update,
    :settings,
    :users,
    :groups, :add_group, :delete_group,
    :delete_image,
    :project_tags
  ]

  PROJECT_PER_PAGE = 25

  def index
    @projects = @projects.order(updated_at: :desc).search_by_keyword(params[:keywords]).page(params[:page]).per(PROJECT_PER_PAGE)
    # 自分が属している自身のプロジェクトがない場合には作成を促すメッセージを表示するためのフラグ
    @is_not_exits_own_project = @projects.all? { |project| project.is_public && !project.users.include?(current_user) }
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

  def show_with_ticket_number
    ticket_number = params[:ticket_number]

    if ticket_number.match(/([A-Za-z]+)-([0-9]+)/)
      ticket_prefix = Regexp.last_match(1)
      ticket_id = Regexp.last_match(2)
      project = Project.find_by(ticket_prefix: ticket_prefix)
      ticket = Ticket.find_by(project: project, ticket_number: ticket_id)

      redirect_to(root_path, alert: t('message.ticket_not_found', ticket_number: ticket_number, default: "Ticket #{ticket_number} not Found")) && return if ticket.blank?

      redirect_to_with_ticket(ticket_number, project, ticket)
    end

    redirect_to(root_path, alert: t('message.ticket_not_found', ticket_number: ticket_number, default: "Ticket #{ticket_number} not Found")) && return if ticket.blank?
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

  def project_tags
    @tags = Tag.where(project: @project)
  end

  private

  def project_params
    params.fetch(:project, {}).permit!
  end

  def set_project
    @project = Project.find(params[:id])
  end

  def redirect_to_with_ticket(ticket_number, project, ticket)
    case ticket.type
    when 'Story'
      redirect_to File.join("#{project_path(project)}#", 'stories', ticket.id.to_s)
    when 'Task'
      story = ticket.story
      sprint = story.sprint

      if sprint.blank?
        path = File.join("#{project_path(project)}#", 'stories', story.id.to_s)
        path = "#{path}?message_type=danger&message=#{t('message.task_is_not_in_sprint', ticket_number: ticket_number, default: 'Task is not in Sprint. Currently showing Story.')}"
        redirect_to(path) && return
      end

      redirect_to File.join(project_path(project), 'sprints', sprint.id.to_s, 'kanban#', 'story', story.id.to_s, 'tasks', ticket.id.to_s)
    end
  end
end
