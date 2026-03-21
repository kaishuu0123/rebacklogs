require 'rails_helper'

RSpec.describe 'Groups', type: :request do
  let(:user)  { create(:user) }
  let!(:group) { create(:group, name: 'TestGroup') }

  describe 'GET /groups_by_name' do
    context 'ログイン済み' do
      before { sign_in user }

      it 'グループ名で検索できる' do
        get groups_by_name_path, params: { name: 'Test' }, as: :json
        expect(response).to have_http_status(:ok)
      end
    end

    context '未ログイン' do
      it '401 を返す' do
        get groups_by_name_path, params: { name: 'Test' }, as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
