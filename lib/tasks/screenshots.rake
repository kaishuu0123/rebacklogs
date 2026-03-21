namespace :screenshots do
  desc "README スクリーンショット用デモデータを投入する"
  task seed: :environment do
    load Rails.root.join("screenshots/seed.rb")
  end
end
