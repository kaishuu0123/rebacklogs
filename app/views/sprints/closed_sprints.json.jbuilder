json.sprints do
  json.array! @sprints do |sprint|
    json.extract! sprint, *Sprint.attribute_names
    json.stories do
      json.array! sprint.stories do |story|
        json.extract! story, *Story.attribute_names
        if project_ticket_category = story.project_ticket_category
          json.project_ticket_category do
            json.id project_ticket_category.id
            json.title project_ticket_category.title
            json.color project_ticket_category.color
          end
        end
      end
    end
  end
end