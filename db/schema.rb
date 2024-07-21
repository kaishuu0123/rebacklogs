# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2024_07_21_105519) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "comments", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "ticket_id", null: false
    t.text "body"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["ticket_id"], name: "index_comments_on_ticket_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "group_projects", force: :cascade do |t|
    t.bigint "group_id", null: false
    t.bigint "project_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["group_id", "project_id"], name: "index_group_projects_on_group_id_and_project_id", unique: true
    t.index ["group_id"], name: "index_group_projects_on_group_id"
    t.index ["project_id"], name: "index_group_projects_on_project_id"
  end

  create_table "group_users", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "group_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["group_id", "user_id"], name: "index_group_users_on_group_id_and_user_id", unique: true
    t.index ["group_id"], name: "index_group_users_on_group_id"
    t.index ["user_id"], name: "index_group_users_on_user_id"
  end

  create_table "groups", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "master_ticket_categories", force: :cascade do |t|
    t.string "title"
    t.integer "sort_order"
    t.string "color"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "master_ticket_statuses", force: :cascade do |t|
    t.string "title", default: ""
    t.integer "sort_order", default: 0
    t.boolean "is_done", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "project_ticket_categories", force: :cascade do |t|
    t.bigint "project_id"
    t.string "title"
    t.integer "sort_order"
    t.string "color"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["project_id"], name: "index_project_ticket_categories_on_project_id"
  end

  create_table "project_ticket_statuses", force: :cascade do |t|
    t.bigint "project_id"
    t.string "title"
    t.integer "sort_order"
    t.boolean "is_done", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["project_id"], name: "index_project_ticket_statuses_on_project_id"
  end

  create_table "projects", force: :cascade do |t|
    t.string "title"
    t.text "body"
    t.string "ticket_prefix", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "is_public", default: false
    t.index ["ticket_prefix"], name: "index_projects_on_ticket_prefix", unique: true
  end

  create_table "roles", force: :cascade do |t|
    t.string "name"
    t.string "resource_type"
    t.bigint "resource_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id"
    t.index ["name"], name: "index_roles_on_name"
    t.index ["resource_type", "resource_id"], name: "index_roles_on_resource_type_and_resource_id"
  end

  create_table "settings", force: :cascade do |t|
    t.string "var", null: false
    t.text "value"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["var"], name: "index_settings_on_var", unique: true
  end

  create_table "social_profiles", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "provider"
    t.string "uid"
    t.string "name"
    t.string "nickname"
    t.string "email"
    t.string "url"
    t.string "image_url"
    t.string "description"
    t.text "others"
    t.text "credentials"
    t.text "raw_info"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["provider", "uid"], name: "index_social_profiles_on_provider_and_uid", unique: true
    t.index ["user_id"], name: "index_social_profiles_on_user_id"
  end

  create_table "sprints", force: :cascade do |t|
    t.bigint "project_id"
    t.string "title"
    t.datetime "start_datetime"
    t.datetime "end_datetime"
    t.boolean "closed", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["project_id"], name: "index_sprints_on_project_id"
  end

  create_table "tag_tickets", force: :cascade do |t|
    t.bigint "tag_id"
    t.bigint "ticket_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["tag_id", "ticket_id"], name: "index_tag_tickets_on_tag_id_and_ticket_id", unique: true
    t.index ["tag_id"], name: "index_tag_tickets_on_tag_id"
    t.index ["ticket_id"], name: "index_tag_tickets_on_ticket_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name", null: false
    t.bigint "project_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["id", "project_id"], name: "index_tags_on_id_and_project_id", unique: true
    t.index ["project_id"], name: "index_tags_on_project_id"
  end

  create_table "tickets", force: :cascade do |t|
    t.bigint "project_id"
    t.bigint "sprint_id"
    t.bigint "ticket_id"
    t.bigint "project_ticket_category_id"
    t.bigint "project_ticket_status_id"
    t.bigint "assignee_id"
    t.string "type"
    t.integer "ticket_number"
    t.string "title"
    t.text "body"
    t.float "point"
    t.boolean "is_done", default: false
    t.integer "sort_order"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["assignee_id"], name: "index_tickets_on_assignee_id"
    t.index ["project_id"], name: "index_tickets_on_project_id"
    t.index ["project_ticket_category_id"], name: "index_tickets_on_project_ticket_category_id"
    t.index ["project_ticket_status_id"], name: "index_tickets_on_project_ticket_status_id"
    t.index ["sprint_id"], name: "index_tickets_on_sprint_id"
    t.index ["ticket_id"], name: "index_tickets_on_ticket_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "username"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  create_table "users_roles", id: false, force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "role_id"
    t.index ["role_id"], name: "index_users_roles_on_role_id"
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id"
    t.index ["user_id"], name: "index_users_roles_on_user_id"
  end

  create_table "versions", force: :cascade do |t|
    t.string "item_type"
    t.string "{:null=>false}"
    t.bigint "item_id", null: false
    t.string "event", null: false
    t.string "whodunnit"
    t.text "object"
    t.datetime "created_at"
    t.text "object_changes"
    t.index ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "comments", "tickets"
  add_foreign_key "comments", "users"
  add_foreign_key "group_projects", "groups"
  add_foreign_key "group_projects", "projects"
  add_foreign_key "group_users", "groups"
  add_foreign_key "group_users", "users"
  add_foreign_key "project_ticket_statuses", "projects"
  add_foreign_key "social_profiles", "users"
  add_foreign_key "sprints", "projects"
  add_foreign_key "tag_tickets", "tags"
  add_foreign_key "tag_tickets", "tickets"
  add_foreign_key "tags", "projects"
  add_foreign_key "tickets", "project_ticket_categories"
  add_foreign_key "tickets", "project_ticket_statuses"
  add_foreign_key "tickets", "projects"
  add_foreign_key "tickets", "sprints"
  add_foreign_key "tickets", "tickets"
  add_foreign_key "tickets", "users", column: "assignee_id"
end
