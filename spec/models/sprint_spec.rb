require 'rails_helper'

RSpec.describe Sprint, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:project) }
    it { is_expected.to have_many(:stories) }
  end

  describe 'scopes' do
    let(:project) { create(:project) }
    let!(:open_sprint)   { create(:sprint, project: project, closed: false) }
    let!(:closed_sprint) { create(:sprint, project: project, closed: true) }

    it '.opening はオープン中のスプリントのみ返す' do
      expect(Sprint.opening).to include(open_sprint)
      expect(Sprint.opening).not_to include(closed_sprint)
    end

    it '.closed はクローズ済みのスプリントのみ返す' do
      expect(Sprint.closed).to include(closed_sprint)
      expect(Sprint.closed).not_to include(open_sprint)
    end
  end
end
