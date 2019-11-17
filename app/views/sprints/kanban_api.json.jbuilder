json.array! @sprint.stories do |story|
  json.extract! story, *Story.attribute_names

  if project_ticket_category = story.project_ticket_category
    json.project_ticket_category do
      json.id project_ticket_category.id
      json.title project_ticket_category.title
      json.color project_ticket_category.color
    end
    json.tags do
      json.array! story.tags do |tag|
        json.extract! tag, *Tag.attribute_names
      end
    end
  end

  json.tasks do
    json.array! story.tasks do |task|
      json.extract! task, *Task.attribute_names
      if assignee = task.assignee
        json.assignee do
          json.id assignee.id
          json.username assignee.username
          json.image assignee.user_image_url
        end
      end
    end
  end
end
