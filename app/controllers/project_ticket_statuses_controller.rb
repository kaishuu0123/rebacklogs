class ProjectTicketStatusesController < ApplicationController
  authorize_resource

  before_action :set_project_ticket_status, only: [
    :show, :edit, :update, :destroy
  ]

  def index
    @project_ticket_statuses = ProjectTicketStatus.where(project_id: params[:project_id]).order(:sort_order)
  end

  def show
  end

  def create
    @project_ticket_status = ProjectTicketStatus.new(project_ticket_status_params)

    respond_to do |format|
      if @project_ticket_status.save
        format.json { render :show, status: :created, location: [@project_ticket_status.project, @project_ticket_status] }
      else
        format.json { render json: @project_ticket_status.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @project_ticket_status.update(project_ticket_status_params)
        format.json { render :show, status: :created, location: [@project_ticket_status.project, @project_ticket_status] }
      else
        format.json { render json: @project_ticket_status.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @project_ticket_status.destroy
    respond_to do |format|
      format.json { head :no_content }
    end
  end

  private

  def project_ticket_status_params
    params.permit(
      :title, :sort_order, :project_id, :is_done
    )
  end

  def set_project_ticket_status
    @project_ticket_status = ProjectTicketStatus.find(params[:id])
  end
end