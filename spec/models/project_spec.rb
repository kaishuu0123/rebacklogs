require 'rails_helper'

RSpec.describe Project, type: :model do
  describe 'validations' do
    subject { build(:project) }

    it { is_expected.to validate_presence_of(:title) }
    it { is_expected.to validate_presence_of(:ticket_prefix) }
    it { is_expected.to validate_uniqueness_of(:ticket_prefix) }
  end

  describe 'associations' do
    it { is_expected.to have_many(:sprints) }
    it { is_expected.to have_many(:project_ticket_statuses) }
    it { is_expected.to have_many(:project_ticket_categories) }
    it { is_expected.to have_many(:group_projects).dependent(:destroy) }
    it { is_expected.to have_many(:groups).through(:group_projects) }
  end

  describe '.search_by_keyword' do
    let!(:project_a) { create(:project, title: 'Alpha Project') }
    let!(:project_b) { create(:project, title: 'Beta Project', body: 'alpha content') }
    let!(:project_c) { create(:project, title: 'Gamma Project') }

    it 'title にマッチするプロジェクトを返す' do
      expect(Project.search_by_keyword('Alpha')).to include(project_a)
    end

    it 'body にマッチするプロジェクトを返す' do
      expect(Project.search_by_keyword('alpha content')).to include(project_b)
    end

    it 'マッチしないプロジェクトを含まない' do
      expect(Project.search_by_keyword('Alpha')).not_to include(project_c)
    end

    it 'keyword が空の場合は全件返す' do
      expect(Project.search_by_keyword('')).to include(project_a, project_b, project_c)
    end
  end
end
