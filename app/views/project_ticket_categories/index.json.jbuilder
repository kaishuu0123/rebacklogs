json.array! @project_ticket_categories do |category|
  json.extract! category, *ProjectTicketCategory.attribute_names
end
