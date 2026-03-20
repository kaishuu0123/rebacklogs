require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    subject { build(:user) }

    it { is_expected.to validate_presence_of(:username) }
    it { is_expected.to validate_uniqueness_of(:username).case_insensitive }
    it { is_expected.to validate_presence_of(:email) }
  end

  describe 'associations' do
    it { is_expected.to have_many(:group_users).dependent(:destroy) }
    it { is_expected.to have_many(:groups).through(:group_users) }
    it { is_expected.to have_many(:social_profiles).dependent(:destroy) }
  end

  describe '#assign_default_role' do
    it 'developer ロールが付与される' do
      user = create(:user)
      expect(user.has_role?(:developer)).to be true
    end
  end

  describe '#email_verified?' do
    it '本物のメールアドレスの場合 true を返す' do
      user = build(:user, email: 'real@example.com')
      expect(user.email_verified?).to be true
    end

    it '仮メールアドレスの場合 false を返す' do
      user = build(:user, email: 'change@me.example.com')
      expect(user.email_verified?).to be false
    end
  end

  describe '.find_for_database_authentication' do
    let!(:user) { create(:user, username: 'testuser', email: 'test@example.com') }

    it 'username でログインできる' do
      result = User.find_for_database_authentication(login: 'testuser')
      expect(result).to eq user
    end

    it 'email でログインできる' do
      result = User.find_for_database_authentication(login: 'test@example.com')
      expect(result).to eq user
    end
  end
end
