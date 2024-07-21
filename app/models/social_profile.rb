# refs: https://qiita.com/mnishiguchi/items/e15bbef61287f84b546e
# == Schema Information
#
# Table name: social_profiles
#
#  id          :integer          not null, primary key
#  user_id     :integer
#  provider    :string
#  uid         :string
#  name        :string
#  nickname    :string
#  email       :string
#  url         :string
#  image_url   :string
#  description :string
#  others      :text
#  credentials :text
#  raw_info    :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class SocialProfile < ApplicationRecord
  belongs_to :user
  store      :others

  validates_uniqueness_of :uid, scope: :provider

  def self.find_for_oauth(auth)
    profile = find_or_create_by(uid: auth.uid, provider: auth.provider)
    profile.save_oauth_data!(auth)
    profile
  end

  def save_oauth_data!(auth)
    return unless valid_oauth?(auth)

    provider = auth["provider"]
    policy   = policy(provider, auth)

    self.update!( uid:         policy.uid,
                  name:        policy.name,
                  nickname:    policy.nickname,
                  email:       policy.email,
                  url:         policy.url,
                  image_url:   policy.image_url,
                  description: policy.description,
                  credentials: policy.credentials,
                  raw_info:    policy.raw_info )
  end

  private

  def policy(provider, auth)
    class_name = "#{provider}".classify
    "OAuth::OAuthPolicy::#{class_name}".constantize.new(auth)
  end

  def valid_oauth?(auth)
    (self.provider.to_s == auth['provider'].to_s) && (self.uid == auth['uid'])
  end
end