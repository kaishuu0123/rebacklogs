# == Schema Information
#
# Table name: master_ticket_statuses
#
#  id         :integer          not null, primary key
#  title      :string           default("")
#  sort_order :integer          default(0)
#  is_done    :boolean          default(FALSE)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class MasterTicketStatus < ApplicationRecord
  def self.create_default_en
    self.create([{
      title: 'New',
      sort_order: 1
    },
    {
      title: 'In Progress',
      sort_order: 2
    },
    {
      title: 'Resolved',
      sort_order: 3
    },
    {
      title: 'Feedback',
      sort_order: 4
    },
    {
      title: 'Done',
      sort_order: 5,
      is_done: true
    },
    {
      title: 'Rejected',
      sort_order: 6,
      is_done: true
    }])
  end

  def self.create_default_ja
    self.create([{
      title: '新規',
      sort_order: 1
    },
    {
      title: '進行中',
      sort_order: 2
    },
    {
      title: '解決',
      sort_order: 3
    },
    {
      title: 'フィードバック',
      sort_order: 4
    },
    {
      title: '完了',
      sort_order: 5,
      is_done: true
    },
    {
      title: '却下',
      sort_order: 6,
      is_done: true
    }])
  end
end
