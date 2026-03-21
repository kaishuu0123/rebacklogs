# Rails フロントエンドの変遷

## Rails 1〜2 時代（2005〜2009）— Prototype.js + script.aculo.us

- Rails が Prototype.js を同梱
- `respond_to { |f| f.js }` で `.js.erb` テンプレートを返す
- サーバーが JS コードを文字列で生成して返すという強引な設計
- jQuery の台頭で Prototype が廃れていく

## Rails 3〜4 時代（2010〜2014）— jQuery + UJS

- jQuery に乗り換え（同梱）
- **UJS（Unobtrusive JavaScript）** の導入
  - `data-remote="true"` を HTML に付けるだけで AJAX 化
  - JS をビューから分離する思想
- Asset Pipeline（Sprockets）登場 — JS/CSS をまとめてフィンガープリント付きで配信
- この頃から「Rails は API、フロントは別」という考え方が出始める

## Rails 4〜5 時代（2014〜2018）— Turbolinks 登場

- Turbolinks 登場：「`<body>` だけ AJAX で差し替えて SPA 風にする」
- **賛否両論**：設定不要で速くなる vs サードパーティ JS が壊れる
- React/Vue が台頭してきて「Turbolinks いらない」という声が増える
- Rails 5 で API モード追加（`--api`）→ Rails を JSON API サーバーとして使う道が整備される

## Rails 5〜6 時代（2018〜2021）— Webpacker 登場・混乱期

- Webpack を Rails に統合した **Webpacker** が登場
- Asset Pipeline と Webpacker の **二重管理** という混乱が生まれる
  ```
  app/assets/      ← Sprockets（CSS、画像）
  app/javascript/  ← Webpacker（JS）
  ```
- Vue/React/Angular を Webpacker で使うのが主流に
- Turbolinks は引き続き同梱されるが「外す」人も多い
- **この時期が一番「どれが正解か」わからない混乱期**

## Rails 7 時代（2021〜）— Hotwire + importmap、Webpacker 廃止

Rails 7 は「JS ビルドツールなしで現代的な UI を作る」という**逆張り**で登場。

```ruby
rails new myapp                        # importmap（ビルド不要）
rails new myapp --javascript=esbuild   # esbuild
rails new myapp --javascript=vite      # Vite（非公式→公式化）
```

**Hotwire = Turbo + Stimulus** が新デフォルト：

| | 役割 |
|--|--|
| **Turbo Drive** | Turbolinks の後継 |
| **Turbo Frames** | 部分更新 |
| **Turbo Streams** | リアルタイム差し替え |
| **Stimulus** | 「ちょっとした JS」を HTML に紐付ける |

思想は「**JS をなるべく書かない**」に回帰。

## Rails 7.1〜8 時代（2023〜現在）— Solid シリーズ + 安定

```ruby
gem 'solid_cache'    # キャッシュを DB に
gem 'solid_queue'    # ジョブキューを DB に
gem 'solid_cable'    # ActionCable を DB に（Redis 不要）
```

- **Propshaft** が Asset Pipeline の後継として登場（Sprockets より軽量）
- importmap が成熟、ビルドなし運用が現実的に
- Vite + React の組み合わせ（vite_rails）が「本格フロントエンドを使いたい人向け」として定着
- Hotwire vs React の二極化が明確になる

## まとめ：大きな流れ

| 時期 | 主役 | キーワード |
|------|------|-----------|
| 〜Rails 2 | Prototype.js | サーバーが JS を生成 |
| Rails 3-4 | jQuery + UJS | JS をビューから分離 |
| Rails 4-5 | Turbolinks | SPA 風ページ遷移 |
| Rails 5-6 | Webpacker | 本格フロントエンド統合・混乱期 |
| Rails 7 | Hotwire / Vite+React | JS 回帰 vs 二極化 |
| Rails 8 | Solid シリーズ | インフラ依存を減らす |

Rails の本流は「**JS を最小化する**」方向に戻っています。Webpacker 時代の「なんでも JS」への反省ともいえます。
