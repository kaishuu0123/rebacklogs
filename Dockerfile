FROM node:22-slim AS node

FROM ruby:3.4-slim AS builder

ENV BUNDLER_VERSION=4.0.8

# build deps
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
      build-essential \
      libpq-dev \
      libyaml-dev \
      tzdata \
      git \
      curl \
    && rm -rf /var/lib/apt/lists/*

COPY Gemfile Gemfile.lock /opt/rebacklogs/

WORKDIR /opt/rebacklogs

COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/include/node /usr/local/include/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/bin/node /usr/local/bin/nodejs && \
    ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm

RUN gem install bundler --version ${BUNDLER_VERSION} && \
    bundle install --without development test --path vendor/bundle && \
    find vendor/bundle/ruby -path '*/gems/*/ext/*/Makefile' -exec dirname {} \; | xargs -n1 -P$(nproc) -I{} make -C {} clean

RUN bundle install -j$(nproc) --deployment --without development test

# yarn install
RUN npm install -g yarn
COPY package.json yarn.lock /opt/rebacklogs/
RUN yarn install --pure-lockfile

# assets precompile
COPY . /opt/rebacklogs/
ENV RAILS_ENV="production"
ENV NODE_ENV="production"
RUN SECRET_KEY_BASE=precompile_placeholder bin/rails assets:precompile

FROM ruby:3.4-slim

RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
      libpq-dev \
      tzdata \
      openssl \
      tini \
      wget \
    && rm -rf /var/lib/apt/lists/* && \
    ln -sf /usr/share/zoneinfo/UTC /etc/localtime

# for docker-compose
ENV DOCKERIZE_VERSION=v0.6.1
RUN wget -q https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Create the rebacklogs user
ARG UID=991
ARG GID=991
RUN groupadd --gid $GID rebacklogs && \
    useradd -m -u $UID -g $GID -d /opt/rebacklogs rebacklogs

EXPOSE 3000

WORKDIR /opt/rebacklogs

# Copy gems and compiled assets from builder
COPY --chown=rebacklogs:rebacklogs --from=builder /opt/rebacklogs/vendor/bundle vendor/bundle
COPY --chown=rebacklogs:rebacklogs --from=builder /usr/local/bundle /usr/local/bundle

COPY --chown=rebacklogs:rebacklogs --from=builder /opt/rebacklogs/public/assets/ /opt/rebacklogs/public/assets/
COPY --chown=rebacklogs:rebacklogs --from=builder /opt/rebacklogs/public/vite/ /opt/rebacklogs/public/vite/

# Copy Re:Backlogs source code
COPY --chown=rebacklogs:rebacklogs . /opt/rebacklogs

ENV RAILS_ENV="production"
ENV RAILS_SERVE_STATIC_FILES="true"
ENV BIND="0.0.0.0"

USER rebacklogs

ENTRYPOINT ["/usr/bin/tini", "--"]
