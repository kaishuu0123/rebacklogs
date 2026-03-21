# Re:Backlogs

[![GitHub release](https://img.shields.io/github/release/kaishuu0123/rebacklogs.svg)][releases]
[![Docker Pulls](https://img.shields.io/docker/pulls/kaishuu0123/rebacklogs.svg)][docker]

[releases]: https://github.com/kaishuu0123/rebacklogs/releases
[docker]: https://hub.docker.com/r/kaishuu0123/rebacklogs/

Re:Backlogs is an Open Source project management tool.
It aims to be simple and easy to use Backlogs.

[Japanese:README.ja.md](https://github.com/kaishuu0123/rebacklogs/blob/main/README.ja.md)

- [Re:Backlogs](#rebacklogs)
  - [Screenshot](#screenshot)
  - [Theming](#theming)
  - [Demo](#demo)
  - [About this project](#about-this-project)
    - [Similar Project or Software](#similar-project-or-software)
    - [What is Backlog(s)](#what-is-backlogs)
    - ["Re:" Meaning](#%22re%22-meaning)
  - [Install](#install)
    - [Use docker-compose.yml](#use-docker-composeyml)
  - [Upgrading](#upgrading)
    - [PostgreSQL major version upgrade](#postgresql-major-version-upgrade)
  - [Development instructions](#development-instructions)
    - [Setup](#setup)
    - [Run Re:Backlogs](#run-rebacklogs)
  - [Development motivation](#development-motivation)
  - [Contribute](#contribute)
  - [License](#license)

## Screenshot

| Backlogs | Kanban |
|---|---|
| ![Backlogs](https://raw.githubusercontent.com/kaishuu0123/rebacklogs/main/screenshots/backlogs.png) | ![Kanban](https://raw.githubusercontent.com/kaishuu0123/rebacklogs/main/screenshots/kanban.png) |

## Theming

Re:Backlogs supports preset themes. You can choose a color scheme from the application settings.
When running with `DEMO_MODE=true`, a theme picker is also available directly in the header.

| Clean Slate | Solar Dusk |
|---|---|
| ![Clean Slate](https://raw.githubusercontent.com/kaishuu0123/rebacklogs/main/screenshots/theme_clean_slate.png) | ![Solar Dusk](https://raw.githubusercontent.com/kaishuu0123/rebacklogs/main/screenshots/theme_solar_dusk.png) |

## Demo

Try Re:Backlogs without any setup: **https://rebacklogs.saino.me/**

> This is a demo site. Data may be reset without notice — for testing purposes only.

## About this project
### Similar Project or Software
* [backlogs/redmine_backlogs](https://github.com/backlogs/redmine_backlogs)
* [YouTrack by JetBrains](https://www.jetbrains.com/youtrack/)

### What is Backlog(s)

The basic philosophy is based on redmine_backlogs.
There are several terms related to Backlogs.

* Backlogs
    * A place to accumulate stories
    * Stories can be added freely, independent of any existing Sprint.
* Sprints
    * The basic unit for completing stories within a fixed period. Typically two weeks long.
    * Move stories from Backlogs into a Sprint to plan your work.
* Story
    * Represents a specific unit of work toward achieving a goal.
    * In software development, stories are typically written in the form of “can do” (e.g. user capabilities).
    * For example, when adding a login feature and a comment feature to a web application, you might create:
        * Users can log in to the application
        * Logged-in users can add comments
* Task
    * Create multiple items within a Story.
    * Represents the concrete steps needed to complete a Story.
    * For example, the following tasks can be considered to complete the above-mentioned story of “Login to application”.
        * Implementation
        * Code Review & Feedback
        * Testing

### “Re:” Meaning

“Re:” originally means “reply” in email. It also carries the meaning of “again” from the prefix re-.
I hope to see Backlogs-style project management become widely used once again.

## Install

### Use docker-compose.yml

```bash
git clone https://github.com/kaishuu0123/rebacklogs

docker compose up -d
```

Once started, open http://localhost:3000 in your browser.

## Upgrading

### PostgreSQL major version upgrade

When the `postgres` image version in `docker-compose.yml` jumps to a new
**major** version (e.g. 16 → 18), the existing data volume is **not**
compatible and must be migrated manually before restarting.

**Steps (production / docker-compose):**

```sh
# 1. Dump all data from the running container
docker compose exec db pg_dumpall -U postgres > backup.sql

# 2. Stop the app, then remove the old DB container and volume
docker compose stop app
docker compose stop db && docker compose rm -f db
docker volume rm rebacklogs_postgres-data   # adjust name if needed

# 3. Start the new DB container and restore
docker compose up -d db
# wait a few seconds for postgres to be ready
docker compose exec -T db psql -U postgres < backup.sql

# 4. Restart the app
docker compose up -d app
```

Keep `backup.sql` somewhere safe until you have verified the upgraded
instance is working correctly.

> **Note:** If you accidentally started the new PostgreSQL version without
> migrating, don't panic — PostgreSQL refuses to start with an incompatible
> data directory and leaves it untouched. Simply revert `docker-compose.yml`
> to the previous version and your data will be accessible again. Then follow
> the steps above.

## Development instructions

The recommended setup is **[VSCode](https://code.visualstudio.com/) + [devcontainer](https://code.visualstudio.com/docs/devcontainers/tutorial)**.

### Setup

After the devcontainer is up:

```bash
bundle install
yarn install

bundle exec rails db:create db:migrate
```

### Run Re:Backlogs

```bash
# terminal 1: Vite dev server (React pages)
bin/vite dev

# terminal 2: Rails server
bin/rails s
```

Open http://localhost:3000 in your browser.

## Development motivation
There are several.

* Of course I want to create easy-to-use Backlogs
* Aim to provide comprehensive OSS including document sites
* I want to make my portfolio
    * To reflect the know-how accumulated so far in Re:Backlogs
* Build a not-SPA service using vite_rails + turbo-mount + React
    * Use an existing session mechanism that does not use JWT, and prepare an environment for developing modern front ends.

## Contribute

Issues and PRs are welcome in either English or Japanese.
(Note: Japanese may lead to smoother communication.)

If you want to add a large feature, please open an issue first to discuss it.
Large PRs submitted without prior discussion may be rejected at the concept stage.

## License

This software is based on the MIT License with an additional restriction:
you may not use this software to provide commercial services to third parties
(e.g. SaaS, hosted services) where the primary value derives from this software.

Personal use and internal business use are explicitly permitted.

See [LICENSE](./LICENSE) for details.
