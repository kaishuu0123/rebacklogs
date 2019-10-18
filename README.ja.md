# Re:Backlogs

Re:Backlogs は、Open Source なプロジェクト管理ツールです。
シンプルで使いやすい Backlogs を目指しています。

## このプロジェクトについて
### 似たようなプロジェクトやソフトウェア
* [backlogs/redmine_backlogs](https://github.com/backlogs/redmine_backlogs)
* [YouTrack by JetBrains](https://www.jetbrains.com/youtrack/)

### Backlogs とは

redmine_backlogs をベースにしていますが、この Backlogs に関する下記のような用語があります。

* Backlogs
    * Story を溜めて置く場所です
    * 既存の Sprint に縛られず、Story を追加していきます。
* Sprints
    * 定められた期間内に Story を消化する基本単位です。大体は 2週間で区切られます。
    * Backlogs から Story を Sprint に追加して、計画を立てます
* Story
    * 何かを成し遂げるための具体的な粒度を表します
    * ソフトウェア開発に利用するときには「〜できる」という形式で書くのが基本です
    * 例えば、Web アプリケーションにログイン機能を追加し、コメントを追加できる機能を実装する場合、下記のようなストーリーを作成します
        * アプリケーションにログインできる
        * ログインしたユーザでコメントが追加できる
* Task
    * 1 Story 内に複数作成します。
    * ここではストーリーを完了するための具体的なタスクを表します
    * 例えば、上記の「アプリケーションにログインできる」というストーリーを完遂するには以下のようなタスクが考えられます
        * 実装
        * コードレビュー & フィードバック
        * 動作確認

### Re: に込めた意味

Re: の本来の意味は Email における「返信」を意味しますが、
接頭辞の re- の意味でもある again という意味も含んでいます。
もう一度 Backlogs を用いたプロジェクト管理が普及するように願いを込めています。

## インストール

### docker-compose.yml を使う例

```command
git clone https://github.com/kaishuu0123/rebacklogs

docker-compose up -d
```

## 開発環境構築手順
### 必須ソフト

* Ruby
* bundler
* Node.js
* yarn

### セットアップ

```command
bundle install --path=vendor/bundle
yarn install

bundle exec rails db:create db:migrate
```

### Re:Backlogs を起動する

```
# 他のウインドウでコマンドを実行
bin/webpack-devserver

# メインウインドウでコマンドを実行
bin/rails s
```

## 開発モチベーション
いくつかあります。

* もちろん、使いやすい Backlogs を作りたい
* ドキュメントサイトも含めた包括的な OSS の提供を目指したい
* 自分のポートフォリオとしたい
    * 今まで蓄積したノウハウを Re:Backlogs に反映したい
* webpacker を利用した not SPA なサービスを作りたい
    * JWT を利用しない、既存の session の仕組みを使って、今風なフロントエンドを開発できる環境を整えること

## ライセンス

* MIT
* LICENSE を確認してください
