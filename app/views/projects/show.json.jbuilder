json.extract! @project, *Project.attribute_names
json.image @project.project_image_url
json.is_image_attached @project.image.present?