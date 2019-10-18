class SprintsController < ApplicationController
  authorize_resource

  before_action :set_sprint, only: [
    :show, :kanban, :kanban_api, :update
  ]

  def index
    @sprints = Sprint.opening.where(project: params[:project_id])
    @stories_in_backlogs = Story.where(project: params[:project_id], sprint: nil).order(:sort_order)
  end

  def closed_sprints
    @sprints = Sprint.closed.where(project: params[:project_id])
  end

  def show
  end

  def kanban
  end

  def kanban_api
  end

  def create
    @sprint = Sprint.new(sprint_params)
    if @sprint.save
      render :show, status: :ok, location: [@sprint.project, @sprint]
    else
      render json: @sprint.errors, status: :unprocessable_entity
    end
  end

  def update
    if @sprint.update(sprint_params)
      render :show, status: :ok, location: [@sprint.project, @sprint]
    else
      render json: @sprint.errors, status: :unprocessable_entity
    end
  end

  def destroy
  end

  private

  def sprint_params
    params.permit(:project_id, :closed, :title, :start_datetime, :end_datetime)
  end

  def set_sprint
    @sprint = Sprint.find(params[:id])
  end
end
