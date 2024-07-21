# refs: https://qiita.com/mnishiguchi/items/e15bbef61287f84b546e
module OAuthPolicy
  class Base
    attr_reader :provider, :uid, :name, :nickname, :email, :url, :image_url,
                :description, :other, :credentials, :raw_info
  end

  class Github < OAuthPolicy::Base
    def initialize(auth)
      @provider    = auth['provider']
      @uid         = auth['uid']
      @name        = auth['info']['name']
      @nickname    = ''
      @email       = ''
      @url         = 'https://github.com/'
      @image_url   = auth['info']['image']
      @description = ''
      @credentials = auth['credentials'].to_json
      @raw_info    = auth['extra']['raw_info'].to_json
      freeze
    end
  end

  class GoogleOauth2 < OAuthPolicy::Base
    def initialize(auth)
      @provider    = auth['provider']
      @uid         = auth['uid']
      @name        = auth['info']['name']
      @nickname    = ''
      @email       = ''
      @url         = 'https://google.com/'
      @image_url   = auth['info']['image']
      @description = ''
      @credentials = auth['credentials'].to_json
      @raw_info    = auth['extra']['raw_info'].to_json
      freeze
    end
  end
end
