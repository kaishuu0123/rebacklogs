module ApplicationHelper
  def nav_link(*args, &block)
    name = block_given? ? capture(&block) : args.shift
    options = args.shift || {}
    html_options = args.shift || {}

    active_class = html_options[:active] || "active"
    html_options[:class] = "#{html_options[:class]} nav-item"
    html_options[:class] = "#{html_options[:class]} #{active_class}" if current_page?(options)

    content_tag(:li, html_options) do
      link_to(name, options, { class: 'nav-link' })
    end
  end

  def changes_from_version_helper(version)
    return [] if version.object_changes.blank?

    changes = YAML.load(version.object_changes)
    change_keys = changes.keys.reject { |key| key == :updated_at.to_s }

    change_keys.map do |key|
      change_value = changes[key]
      before = change_value[0]
      after = change_value[1]

      case key.to_sym
      when :assignee_id
        {
          attribute: 'assignee',
          before: User.find_by(id: before)&.username || 'None',
          after: User.find_by(id: after)&.username || 'None'
        }
      when :sprint_id
        {
          attribute: 'sprint',
          before: Sprint.find_by(id: before)&.title || 'None',
          after: Sprint.find_by(id: after)&.title || 'None'
        }
      when :project_ticket_category_id
        {
          attribute: 'category',
          before: ProjectTicketCategory.find_by(id: before)&.title || 'None',
          after: ProjectTicketCategory.find_by(id: after)&.title || 'None'
        }
      when :project_ticket_status_id
        {
          attribute: 'status',
          before: ProjectTicketStatus.find_by(id: before)&.title || 'None',
          after: ProjectTicketStatus.find_by(id: after)&.title || 'None'
        }
      else
        {
          attribute: key,
          before: before,
          after: after
        }
      end
    end
  end
end
