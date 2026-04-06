module Broadcastable
  extend ActiveSupport::Concern

  included do
    after_commit :broadcast_update
  end

  private

  def broadcast_update
    project_id = resolve_project_id
    return unless project_id

    payload = build_payload(project_id)
    key = payload.values.join('-')

    Current.broadcast_events_sent ||= Set.new
    return if Current.broadcast_events_sent.include?(key)
    Current.broadcast_events_sent.add(key)

    ActionCable.server.broadcast("project_#{project_id}", payload)
  end

  def resolve_project_id
    if respond_to?(:project_id)
      project_id
    elsif respond_to?(:ticket)
      ticket&.project_id
    end
  end

  def build_payload(project_id)
    case self
    when Sprint, Story
      { event: 'sprint_updated', project_id: project_id }
    when Task
      { event: 'task_updated', project_id: project_id, sprint_id: sprint_id }
    when Comment
      { event: 'comment_updated', project_id: project_id, ticket_id: ticket_id, ticket_type: ticket&.type&.downcase&.pluralize }
    else
      { event: 'ticket_updated', project_id: project_id }
    end
  end
end
