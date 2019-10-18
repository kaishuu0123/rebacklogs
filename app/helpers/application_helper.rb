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
end
