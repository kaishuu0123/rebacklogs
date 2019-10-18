json.array! @project_ticket_statuses do |status|
  json.extract! status, *ProjectTicketStatus.attribute_names
end
