# Re:Backlogs

[![GitHub release](https://img.shields.io/github/release/kaishuu0123/rebacklogs.svg)][releases]
[![Docker Pulls](https://img.shields.io/docker/pulls/kaishuu0123/rebacklogs.svg)][docker]

[releases]: https://github.com/kaishuu0123/rebacklogs/releases
[docker]: https://hub.docker.com/r/kaishuu0123/rebacklogs/

Re:Backlogs is an Open Source project management tool.
It aims to be simple and easy to use Backlogs.

[Japanese:README.ja.md](https://github.com/kaishuu0123/rebacklogs/blob/master/README.ja.md)

- [Re:Backlogs](#rebacklogs)
  - [Screenshot](#screenshot)
  - [Demo](#demo)
  - [About this project](#about-this-project)
    - [Similar Project or Software](#similar-project-or-software)
    - [What is Backlog(s)](#what-is-backlogs)
    - ["Re:" Meaning](#%22re%22-meaning)
  - [Install](#install)
    - [Use docker-compose.yml](#use-docker-composeyml)
  - [Development instructions](#development-instructions)
    - [Requirements](#requirements)
    - [Setup](#setup)
    - [Run Re:Backlogs](#run-rebacklogs)
  - [Development motivation](#development-motivation)
  - [Contribute](#contribute)
  - [License](#license)

## Screenshot

<img src="https://raw.githubusercontent.com/kaishuu0123/rebacklogs/master/images_for_README/backlogs.png" width="400"> <img src="https://raw.githubusercontent.com/kaishuu0123/rebacklogs/master/images_for_README/kanban.png" width="400">

## Demo

* https://rebacklogs.saino.me/
  * this is a demo site, there is a possibility that data may disappear suddenly. Please use for testing

## About this project
### Similar Project or Software
* [backlogs/redmine_backlogs](https://github.com/backlogs/redmine_backlogs)
* [YouTrack by JetBrains](https://www.jetbrains.com/youtrack/)

### What is Backlog(s)

The basic philosophy is based on redmine_backlogs.
There are several terms related to Backlogs.

* Backlogs
    * A place to store stories
    * Story will be added without being bound by existing Sprint.
* Sprints
    * Basic unit that digests a story within a set period. Generally, it is separated by 2 weeks.
    * Add Story to Sprint from Backlogs and plan
* Story
    * Represents the specific granularity to accomplish something
    * When using for software development, it is basic to write in the form of “can do”
    * For example, if you add a login function to a web application and implement a function that allows you to add comments, create the following story
        * Log in to the application
        * You can add comments as a logged-in user
* Task
    * 1 Create multiple items in Story.
    * Here are the specific tasks to complete the story
    * For example, the following tasks can be considered to complete the above-mentioned story of “Login to application”.
        * Implementation
        * Code Review & Feedback
        * Testing

### "Re:" Meaning

The original meaning of Re: means “reply” in email,
It also includes the meaning of again, which is part of the prefix re-.
I hope that the project management using Backlogs will spread again.

## Install

### Use docker-compose.yml

```command
git clone https://github.com/kaishuu0123/rebacklogs

docker-compose up -d
```

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
### Requirements

* Ruby
* bundler
* Node.js
* yarn

### Setup

```command
bundle install --path=vendor/bundle
yarn install

bundle exec rails db:create db:migrate
```

### Run Re:Backlogs

```
# terminal 1: Vite dev server (React pages)
bin/vite dev

# terminal 2: Rails server
bin/rails s
```

## Development motivation
There are several.

* Of course I want to create easy-to-use Backlogs
* Aim to provide comprehensive OSS including document sites
* I want to make my portfolio
    * To reflect the know-how accumulated so far in Re:Backlogs
* Build a not-SPA service using vite_rails + turbo-mount + React
    * Use an existing session mechanism that does not use JWT, and prepare an environment for developing modern front ends.

## Contribute

kaishuu0123 is Japanese, but just started learning English.

You can write issues and PRs in English or Japanese.

If you want to add a large feature, etc., it will be smooth if you create issue first and then discussion.
Even if a big PR is suddenly thrown, it may be rejected at the concept stage.

## License

This software is based on the MIT License with an additional restriction:
you may not use this software to provide commercial services to third parties
(e.g. SaaS, hosted services) where the primary value derives from this software.

Personal use and internal business use are explicitly permitted.

See [LICENSE](./LICENSE) for details.
