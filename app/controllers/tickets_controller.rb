class TicketsController < ApplicationController
  authorize_resource

  before_action :set_paper_trail_whodunnit
  before_action :set_ticket, only: [:show, :update, :destroy]

  def index
  end

  def show
  end

  def create
    @ticket = ticket_type.new(ticket_params)
    authorize! :manage, @ticket

    if @ticket.project_ticket_status.blank?
      @ticket.project_ticket_status = @ticket.project.project_ticket_statuses.order(:sort_order).first
    end

    respond_to do |format|
      if @ticket.save
        format.json { render :show, status: :ok, location: [@ticket.project, @ticket] }
      else
        format.json { render json: @ticket.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    authorize! :manage, @ticket
    if @ticket.update(ticket_params)
      render :show, status: :ok, location: [@ticket.project, @ticket]
    else
      render json: @ticket.errors, status: :unprocessable_entity
    end
  end

  def destroy
    authorize! :manage, @ticket
    @ticket.destroy

    respond_to do |format|
      format.json { head :no_content }
    end
  end

  private

  def ticket_params
    params.permit(
      :title, :body, :project_id, :sprint_id, :row_order_position,
      :story_id, :project_ticket_status_id, :project_ticket_category_id,
      :assignee_id, :point
    )
  end

  def ticket_type
    params.fetch(:type)
  end

  def set_ticket
    @ticket = ticket_type.find(params[:id])
  end
end
