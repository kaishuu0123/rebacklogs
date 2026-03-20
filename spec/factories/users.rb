FactoryBot.define do
  factory :user do
    sequence(:username) { |n| "user#{n}" }
    sequence(:email)    { |n| "user#{n}@example.com" }
    password { 'password123' }
    password_confirmation { 'password123' }
    skip_create_default_group { false }
  end

  factory :admin_user, parent: :user do
    after(:create) { |u| u.add_role(:admin) }
  end
end
