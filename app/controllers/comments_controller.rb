class CommentsController < ApplicationController
  authorize_resource

  before_action :set_paper_trail_whodunnit
  before_action :set_comment, only: [:show, :update, :destroy]

  def index
  end

  def show
  end

  def create
    @comment = Comment.new(comment_params)
    @comment.user = current_user

    respond_to do |format|
      if @comment.save
        format.json { head :created, location: [@comment.ticket.project, @comment.ticket, @comment] }
      else
        format.json { render json: @comment.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    if @comment.update(comment_params)
      render :show, status: :ok, location: [@comment.project, @comment]
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @comment.destroy
    respond_to do |format|
      format.json { head :no_content }
    end
  end

  private

  def comment_params
    params.permit(
      :ticket_id, :user_id, :body
    )
  end

  def set_comment
    @comment = Comment.find(params[:id])
  end
end
