json.array! @tags do |tag|
  json.extract! tag, *Tag.attribute_names
end
