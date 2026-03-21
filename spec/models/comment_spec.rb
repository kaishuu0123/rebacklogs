# == Schema Information
#
# Table name: comments
#
#  id         :bigint           not null, primary key
#  body       :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  ticket_id  :bigint           not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_comments_on_ticket_id  (ticket_id)
#  index_comments_on_user_id    (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (ticket_id => tickets.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Comment, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:ticket) }
    it { is_expected.to belong_to(:user) }
  end

  describe 'ticket 経由でプロジェクトにアクセスできる' do
    it 'comment.ticket.project でプロジェクトを取得できる' do
      project = create(:project)
      status  = create(:project_ticket_status, project: project)
      story   = create(:story, project: project, project_ticket_status: status)
      user    = create(:user)
      comment = create(:comment, ticket: story, user: user)
      expect(comment.ticket.project).to eq(project)
    end
  end
end
