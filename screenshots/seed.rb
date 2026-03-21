# README 用スクリーンショットのデモデータ投入
# べき等: 何度実行しても同じ結果になる

puts "=== Screenshot seed: start ==="

# --- Installer ---
unless Setting.installed
  Setting.installed = true
  puts "  Setting.installed = true"
end

# --- Users ---

admin = User.find_by(username: "admin") || User.find_by(email: "admin@example.com") || User.new
if admin.new_record?
  admin.username = "admin"
  admin.email = "admin@example.com"
  admin.password = "password"
  admin.password_confirmation = "password"
  admin.skip_create_default_group = true
  admin.save!
  admin.add_role(:admin)
  admin.add_role(:developer)
  puts "  Created user: admin"
else
  puts "  User already exists: admin"
end

kaishuu = User.find_by(username: "kaishuu0123") || User.find_by(email: "kaishuu0123@example.com") || User.new
if kaishuu.new_record?
  kaishuu.username = "kaishuu0123"
  kaishuu.email = "kaishuu0123@example.com"
  kaishuu.password = "password"
  kaishuu.password_confirmation = "password"
  kaishuu.skip_create_default_group = true
  kaishuu.save!
  kaishuu.add_role(:developer)
  puts "  Created user: kaishuu0123"
else
  puts "  User already exists: kaishuu0123"
end

# --- Group ---

group = Group.find_or_create_by!(name: "Re:Backlogs Team")
group.users << admin    unless group.users.include?(admin)
group.users << kaishuu  unless group.users.include?(kaishuu)

# --- Project ---

project = Project.find_or_initialize_by(ticket_prefix: "REEN")
if project.new_record?
  project.title = "Re:Backlogs"
  project.body  = "Open Source project management tool."
  project.save!
  project.groups << group
  puts "  Created project: REEN"
else
  puts "  Project already exists: REEN"
  project.groups << group unless project.groups.include?(group)
end

# --- Statuses ---

status_defs = ["New", "In Progress", "Resolved", "Feedback", "Done", "Rejected"]
statuses = status_defs.map.with_index(1) do |title, i|
  ProjectTicketStatus.find_or_create_by!(project: project, title: title) do |s|
    s.sort_order = i
  end
end
status_map = statuses.index_by(&:title)

# --- Sprints ---

sprint1 = Sprint.find_or_create_by!(project: project, title: "Sprint-1")
sprint2 = Sprint.find_or_create_by!(project: project, title: "Sprint-2")

# --- Stories ---

def find_or_create_story(project:, sprint:, title:, status:)
  Story.find_or_create_by!(project: project, title: title) do |s|
    s.sprint = sprint
    s.project_ticket_status = status
    s.sort_order = Story.where(project: project).count
  end
end

new_status         = status_map["New"]
in_progress_status = status_map["In Progress"]

# Sprint-1
story1 = find_or_create_story(project: project, sprint: sprint1, title: "Can Create Public Project in Create Project Page", status: new_status)
story2 = find_or_create_story(project: project, sprint: sprint1, title: "Deploy to Demo site",                                status: new_status)

# Sprint-2
story3 = find_or_create_story(project: project, sprint: sprint2, title: "Add Link to Docs pages from Re:Backlogs", status: new_status)
story4 = find_or_create_story(project: project, sprint: sprint2, title: "Can Add Tags to Ticket",                  status: new_status)

# Backlogs (sprint なし)
[
  "Can View Ticket History",
  "Can File upload for Tickets",
  "Can direct access to ticket URL",
  "Can copy Ticket Title to clipboard",
  "Can OAuth Login & Registration",
  "[NEED SPEC] Can Ticket multiselect",
  "[NEED SPEC] Bulk Operation for Ticket",
  "Can support pagination for Project index",
].each do |title|
  find_or_create_story(project: project, sprint: nil, title: title, status: new_status)
end

# --- Tasks ---

def find_or_create_task(story:, title:, status:, assignee: nil)
  Task.find_or_create_by!(ticket_id: story.id, title: title) do |t|
    t.project = story.project
    t.project_ticket_status = status
    t.assignee = assignee
    t.sort_order = Task.where(ticket_id: story.id).count
  end
end

# story1: Can Create Public Project in Create Project Page
find_or_create_task(story: story1, title: "Review & Merge",  status: new_status)
find_or_create_task(story: story1, title: "Implementation",  status: in_progress_status)
find_or_create_task(story: story1, title: "Testing",         status: new_status)

# story2: Deploy to Demo site
find_or_create_task(story: story2, title: "Deploy",               status: new_status,         assignee: admin)
find_or_create_task(story: story2, title: "Settings for Demo site", status: in_progress_status, assignee: kaishuu)

# story4: Can Add Tags to Ticket
find_or_create_task(story: story4, title: "Implementation", status: new_status)
find_or_create_task(story: story4, title: "Review",         status: new_status)

# --- Write URLs for Playwright ---

urls = {
  backlogs_url: "/projects/#{project.id}",
  kanban_url:   "/projects/#{project.id}/sprints/#{sprint1.id}/kanban",
}
FileUtils.mkdir_p(Rails.root.join("tmp"))
File.write(Rails.root.join("tmp/screenshot_urls.json"), JSON.generate(urls))

puts "=== Screenshot seed: done ==="
puts "  Backlogs: #{urls[:backlogs_url]}"
puts "  Kanban:   #{urls[:kanban_url]}"
