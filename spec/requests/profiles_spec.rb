require 'rails_helper'

RSpec.describe 'Profiles', type: :request do
  let(:user) { create(:user) }

  describe 'GET /profiles' do
    context 'ログイン済み' do
      before { sign_in user }

      it '200 を返す' do
        get profiles_path
        expect(response).to have_http_status(:ok)
      end
    end

    context '未ログイン' do
      it 'ログインページにリダイレクトする' do
        get profiles_path
        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end

  describe 'PATCH /profiles' do
    context 'ログイン済み' do
      before { sign_in user }

      it 'ユーザー名を更新できる' do
        patch profiles_path, params: { user: { username: 'newname' } }
        expect(user.reload.username).to eq('newname')
      end
    end
  end
end
