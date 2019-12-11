json.extract! @ticket, *@ticket.class.attribute_names

if @ticket.class == Story && project_ticket_category = @ticket.project_ticket_category
  json.project_ticket_category do
    json.id project_ticket_category.id
    json.title project_ticket_category.title
    json.color project_ticket_category.color
  end
end

if @ticket.class == Story
  json.tags do
    json.array! @ticket.tags do |tag|
      json.extract! tag, *Tag.attribute_names
    end
  end

  json.tasks do
    json.array! @ticket.tasks do |task|
      json.extract! task, *Task.attribute_names
      json.project_ticket_status task&.project_ticket_status&.title
    end
  end
end

if @ticket.class == Task
  story = @ticket.story
  json.story do
    json.id story.id
    json.title story.title
    json.ticket_number_with_ticket_prefix story.ticket_number_with_ticket_prefix
    if project_ticket_category = story.project_ticket_category
      json.project_ticket_category do
        json.id project_ticket_category.id
        json.title project_ticket_category.title
        json.color project_ticket_category.color
      end
    end
  end
end

if project_ticket_status = @ticket.project_ticket_status
  json.project_ticket_status do
    json.id project_ticket_status.id
    json.title project_ticket_status.title
  end
end

if assignee = @ticket.assignee
  json.assignee do
    json.id assignee.id
    json.username assignee.username
    json.image assignee.user_image_url
  end
end

if created_user_by = @ticket.created_user_by
  json.created_user do
    json.id created_user_by.id
    json.username created_user_by.username
  end
end

if last_updated_user_by = @ticket.last_updated_user_by
  json.last_updated_user do
    json.id last_updated_user_by.id
    json.username last_updated_user_by.username
  end
end

if comments = @ticket.comments
  json.comments do
    json.array! comments do |comment|
      json.id comment.id
      json.body comment.body
      json.user do
        json.id comment.user.id
        json.username comment.user.username
        json.image comment.user.user_image_url
      end
      json.created_at comment.created_at
    end
  end
end

if versions = @ticket.versions.where(event: 'update').order(:created_at)
  json.histories do
    json.array! versions do |version|
      changes = changes_from_version_helper(version)
      next if changes.blank?

      json.id version.id
      json.changed_by User.find_by(id: version.whodunnit)&.username
      json.changed_at version.created_at

      json.changes do
        json.array! changes do |change|
          json.attribute change[:attribute]
          json.before change[:before]
          json.after change[:after]
        end
      end
    end
  end
end
