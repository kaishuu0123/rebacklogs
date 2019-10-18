json.array! @groups do |group|
  json.id group.id
  json.name group.name
  json.image group.group_image_url
end
