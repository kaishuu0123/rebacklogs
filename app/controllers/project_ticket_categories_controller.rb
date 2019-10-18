class ProjectTicketCategoriesController < ApplicationController
  authorize_resource

  before_action :set_project_ticket_category, only: [
    :show, :edit, :update, :destroy
  ]

  def index
    @project_ticket_categories = ProjectTicketCategory.where(project_id: params[:project_id]).order(:sort_order)
  end

  def show
  end

  def create
    @project_ticket_category = ProjectTicketCategory.new(project_ticket_category_params)

    respond_to do |format|
      if @project_ticket_category.save
        format.json { render :show, status: :created, location: [@project_ticket_category.project, @project_ticket_category] }
      else
        format.json { render json: @project_ticket_category.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @project_ticket_category.update(project_ticket_category_params)
        format.json { render :show, status: :created, location: [@project_ticket_category.project, @project_ticket_category] }
      else
        format.json { render json: @project_ticket_category.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @project_ticket_category.destroy
    respond_to do |format|
      format.json { head :no_content }
    end
  end

  private

  def project_ticket_category_params
    params.permit(
      :title, :sort_order, :project_id, :color
    )
  end

  def set_project_ticket_category
    @project_ticket_category = ProjectTicketCategory.find(params[:id])
  end
end
