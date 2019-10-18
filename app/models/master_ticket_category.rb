# == Schema Information
#
# Table name: master_ticket_categories
#
#  id         :integer          not null, primary key
#  title      :string
#  sort_order :integer
#  color      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class MasterTicketCategory < ApplicationRecord
  def self.create_default_en
    self.create([
      {
        title: 'None',
        sort_order: 1,
        color: '#858796'
      },
      {
        title: 'Feature',
        sort_order: 2,
        color: '#4e73df'
      },
      {
        title: 'Improvement',
        sort_order: 3,
        color: '#1cc88a'
      },
      {
        title: 'Bugfix',
        sort_order: 4,
        color: '#e74a3b'
      },
      {
        title: 'Support',
        sort_order: 5,
        color: '#36b9cc'
      }
    ])
  end

  def self.create_default_ja
    self.create([
      {
        title: 'なし',
        sort_order: 1,
        color: '#858796'
      },
      {
        title: '機能',
        sort_order: 2,
        color: '#4e73df'
      },
      {
        title: '改善',
        sort_order: 3,
        color: '#1cc88a'
      },
      {
        title: 'バグフィックス',
        sort_order: 4,
        color: '#e74a3b'
      },
      {
        title: 'サポート',
        sort_order: 5,
        color: '#36b9cc'
      }
    ])
  end
end
