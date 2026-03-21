require 'rails_helper'

RSpec.describe 'ApplicationSettings', type: :request do
  let(:user)  { create(:user) }
  let(:admin) { create(:user).tap { |u| u.add_role(:admin) } }

  describe 'GET /application_settings' do
    context 'admin ユーザー' do
      before { sign_in admin }

      it '200 を返す' do
        get application_settings_path
        expect(response).to have_http_status(:ok)
      end
    end

    context '一般ユーザー' do
      before { sign_in user }

      it 'ルートにリダイレクトする（権限なし）' do
        get application_settings_path
        expect(response).to redirect_to(root_url)
      end
    end

    context '未ログイン' do
      it 'ログインページにリダイレクトする' do
        get application_settings_path
        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end
end
