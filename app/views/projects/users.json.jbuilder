json.array! @users do |user|
  json.id user.id
  json.username user.username
  json.image user.user_image_url
end
