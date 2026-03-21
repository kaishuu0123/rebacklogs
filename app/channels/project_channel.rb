class ProjectChannel < ApplicationCable::Channel
  def subscribed
    project = Project.find_by(id: params[:project_id])
    reject unless project && can_read_project?(project)
    stream_from "project_#{params[:project_id]}"
  end

  def unsubscribed; end

  private

  def can_read_project?(project)
    return true if project.is_public
    return false unless current_user.present?
    return true if current_user.has_role?(:admin)
    (project.groups.pluck(:id) & current_user.groups.pluck(:id)).any?
  end
end
