class TicketsController < ApplicationController
  authorize_resource

  before_action :set_paper_trail_whodunnit
  before_action :set_ticket, only: [:show, :update, :destroy]

  def index
  end

  def show
  end

  def create
    @ticket = ticket_type.new(ticket_params.except(:tags))
    authorize! :manage, @ticket

    if @ticket.project_ticket_status.blank?
      @ticket.project_ticket_status = @ticket.project.project_ticket_statuses.order(:sort_order).first
    end

    if ticket_params[:tags].class == Array
      (ticket_params[:tags] || []).each do |tag|
        @ticket.tags << Tag.find_or_create_by!(name: tag[:name], project_id: ticket_params[:project_id])
      end
    end

    respond_to do |format|
      if @ticket.save
        format.json { render :show, status: :ok, location: [@ticket.project, @ticket] }
      else
        format.json { render json: @ticket.errors, status: :unprocessable_entity }
      end
    end
  end

  def row_orders
    story_params = params.permit(_json: [
      :id, :row_order_position, :sprint_id,
      :story_id, :project_ticket_status_id
    ]).fetch(:_json).map do |story|
      {
        id: story[:id]&.to_i,
        row_order_position: story[:row_order_position]&.to_i,
        sprint_id: story[:sprint_id]&.to_i,
        story_id: story[:story_id]&.to_i,
        project_ticket_status_id: story[:project_ticket_status_id]&.to_i
      }
    end.sort_by { |param| param[:row_order_position] }

    ids = story_params.map { |story_param| story_param[:id] }
    @tickets = ticket_type.where(id: ids)
    @tickets.each do |ticket|
      authorize! :manage, ticket
    end

    story_params.each do |story_param|
      ticket = @tickets.find { |t| t.id == story_param[:id] }

      if ticket_type == Story
        ticket.sprint_id = story_param[:sprint_id]
        ticket.row_order_position = story_param[:row_order_position]
      elsif ticket_type == Task
        ticket.story_id = story_param[:story_id]
        ticket.project_ticket_status_id = story_param[:project_ticket_status_id]
        ticket.row_order_position = story_param[:row_order_position]
      end

      ticket.save!
    end

    respond_to do |format|
      format.json { head :no_content }
    end
  end

  def update
    authorize! :manage, @ticket

    if ticket_params[:tags].class == Array
      @ticket.tag_tickets.destroy_all

      (ticket_params[:tags] || []).each do |tag|
        @ticket.tags << Tag.find_or_create_by!(name: tag[:name], project_id: ticket_params[:project_id])
      end
    end

    if @ticket.update(ticket_params.except(:tags))
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
      :assignee_id, :point, tags: [:id, :name, :project_id]
    )
  end

  def ticket_type
    params.fetch(:type)
  end

  def set_ticket
    @ticket = ticket_type.find(params[:id])
  end
end
