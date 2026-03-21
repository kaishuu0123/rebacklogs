# Re:Backlogs

Re:Backlogs は、Open Source なプロジェクト管理ツールです。
シンプルで使いやすい Backlogs を目指しています。

* [Re:Backlogs](#rebacklogs)
    * [スクリーンショット](#スクリーンショット)
    * [テーマ](#テーマ)
    * [デモ](#デモ)
    * [このプロジェクトについて](#このプロジェクトについて)
       * [似たようなプロジェクトやソフトウェア](#似たようなプロジェクトやソフトウェア)
       * [Backlogs とは](#backlogs-とは)
       * [Re: に込めた意味](#re-に込めた意味)
    * [インストール](#インストール)
       * [docker-compose.yml を使う例](#docker-composeyml-を使う例)
    * [アップグレード](#アップグレード)
       * [PostgreSQL メジャーバージョンアップ](#postgresql-メジャーバージョンアップ)
    * [開発環境構築手順](#開発環境構築手順)
       * [セットアップ](#セットアップ)
       * [Re:Backlogs を起動する](#rebacklogs-を起動する)
    * [開発モチベーション](#開発モチベーション)
    * [Contribute (Issue 起票について)](#contribute-issue-起票について)
    * [ライセンス](#ライセンス)

## スクリーンショット

| Backlogs | Kanban |
|---|---|
| ![Backlogs](https://raw.githubusercontent.com/kaishuu0123/rebacklogs/main/screenshots/backlogs.png) | ![Kanban](https://raw.githubusercontent.com/kaishuu0123/rebacklogs/main/screenshots/kanban.png) |

## テーマ

Re:Backlogs はプリセットテーマに対応しています。Application Settings からテーマを選択できます。
`DEMO_MODE=true` で起動している場合は、ヘッダーのテーマピッカーからも切り替えられます。

| Clean Slate | Solar Dusk |
|---|---|
| ![Clean Slate](https://raw.githubusercontent.com/kaishuu0123/rebacklogs/main/screenshots/theme_clean_slate.png) | ![Solar Dusk](https://raw.githubusercontent.com/kaishuu0123/rebacklogs/main/screenshots/theme_solar_dusk.png) |

## デモ

セットアップ不要ですぐ試せます: **https://rebacklogs.saino.me/**

> デモサイトのため、予告なくデータがリセットされることがあります。お試し用としてご利用ください。

## このプロジェクトについて
### 似たようなプロジェクトやソフトウェア
* [backlogs/redmine_backlogs](https://github.com/backlogs/redmine_backlogs)
* [YouTrack by JetBrains](https://www.jetbrains.com/youtrack/)

### Backlogs とは

基本的なフローは redmine_backlogs をベースにしています。
Backlogs にはいくつかの用語があります。

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

```bash
git clone https://github.com/kaishuu0123/rebacklogs

docker compose up -d
```

起動後、ブラウザで http://localhost:3000 を開いてください。

## アップグレード

### PostgreSQL メジャーバージョンアップ

`docker-compose.yml` の `postgres` イメージが**メジャーバージョン**をまたいで更新された場合（例: 16 → 18）、既存のデータボリュームには互換性がないため、再起動前に手動でデータ移行が必要です。

**手順（本番環境 / docker-compose）:**

```sh
# 1. 起動中のコンテナからデータを全量ダンプ
docker compose exec db pg_dumpall -U postgres > backup.sql

# 2. アプリを停止し、古い DB コンテナとボリュームを削除
docker compose stop app
docker compose stop db && docker compose rm -f db
docker volume rm rebacklogs_postgres-data   # volume 名は環境に合わせて確認

# 3. 新しい DB コンテナを起動してリストア
docker compose up -d db
# 数秒待って postgres が起動してから
docker compose exec -T db psql -U postgres < backup.sql

# 4. アプリを再起動
docker compose up -d app
```

アップグレード後の動作確認が取れるまで `backup.sql` は安全な場所に保管しておいてください。

> **誤って新しいバージョンを起動してしまった場合:** PostgreSQL はバージョン不一致のデータディレクトリを検出すると起動を拒否し、データには一切手を加えません。`docker-compose.yml` を元のバージョンに戻せばデータにアクセスできる状態に戻ります。その後、上記の手順でマイグレーションを実施してください。

## 開発環境構築手順

**[VSCode](https://code.visualstudio.com/) + [devcontainer](https://code.visualstudio.com/docs/devcontainers/tutorial)** での開発を推奨します。

### セットアップ

devcontainer が起動したら：

```bash
bundle install
yarn install

bundle exec rails db:create db:migrate
```

### Re:Backlogs を起動する

```bash
# ターミナル 1: Vite 開発サーバー（React ページ）
bin/vite dev

# ターミナル 2: Rails サーバー
bin/rails s
```

起動後、ブラウザで http://localhost:3000 を開いてください。

## 開発モチベーション
いくつかあります。

* もちろん、使いやすい Backlogs を作りたい
* ドキュメントサイトも含めた包括的な OSS の提供を目指したい
* 自分のポートフォリオとしたい
    * 今まで蓄積したノウハウを Re:Backlogs に反映したい
* vite_rails + turbo-mount + React を利用した not SPA なサービスを作りたい
    * JWT を利用しない、既存の session の仕組みを使って、今風なフロントエンドを開発できる環境を整えること

## Contribute (Issue 起票について)

英語でも日本語でも受け付けます。
(英語だと意思疎通がうまく行かない可能性もあります)

大幅な機能追加などをしたい場合には、まず Issue を立ててから相談してもらえるとスムーズです。
いきなり大きな PR を投げられても、コンセプト段階で却下する可能性もあります。

## ライセンス

MIT ライセンスをベースに、追加制限があります：
第三者に対してこのソフトウェアの機能を主たる価値とする商業的なサービス（SaaS・ホスティングサービス等）を提供することは禁止しています。

個人利用および組織内の業務利用は明示的に許可しています。

詳細は [LICENSE](./LICENSE) を参照してください。
