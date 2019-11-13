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
        color: '#FFFFFF'
      },
      {
        title: 'Feature',
        sort_order: 2,
        color: '#CCE5FF'
      },
      {
        title: 'Improvement',
        sort_order: 3,
        color: '#D4EDDA'
      },
      {
        title: 'Bugfix',
        sort_order: 4,
        color: '#F8D7DA'
      },
      {
        title: 'Support',
        sort_order: 5,
        color: '#FFF3CD'
      }
    ])
  end

  def self.create_default_ja
    self.create([
      {
        title: 'なし',
        sort_order: 1,
        color: '#FFFFFF'
      },
      {
        title: '機能',
        sort_order: 2,
        color: '#CCE5FF'
      },
      {
        title: '改善',
        sort_order: 3,
        color: '#D4EDDA'
      },
      {
        title: 'バグフィックス',
        sort_order: 4,
        color: '#F8D7DA'
      },
      {
        title: 'サポート',
        sort_order: 5,
        color: '#FFF3CD'
      }
    ])
  end
end
