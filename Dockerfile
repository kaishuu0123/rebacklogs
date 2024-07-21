# refs: https://github.com/tootsuite/mastodon
# refs: https://qiita.com/baban/items/99877f9b3065c4cf3d50

FROM node:16.20.2-alpine as node

FROM ruby:3.3.1-alpine as builder

ENV BUNDLER_VERSION 2.5.7

RUN apk --update --no-cache add bash bash-completion

# Use bash for the shell
SHELL ["bash", "-c"]

# build deps package install
# gcc, git etc ...
RUN apk --update --no-cache add shadow sudo busybox-suid postgresql-dev tzdata alpine-sdk

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

RUN cd /opt/rebacklogs && \
	bundle install -j$(nproc) --deployment --without development test

# yarn install
RUN npm install -g yarn
COPY package.json yarn.lock /opt/rebacklogs/
RUN yarn install --pure-lockfile

# assets precompile
COPY . /opt/rebacklogs/
# Run rebacklogs services in prod mode
ENV RAILS_ENV="production"
ENV NODE_ENV="production"
# FOR DEBUG
# RUN cd ~ && NODE_OPTIONS="--max-old-space-size=4096" NODE_ENV=production ./bin/webpack --progress --config config/webpack/production.js
RUN cd /opt/rebacklogs && \
  SECRET_KEY_BASE=precompile_placeholder bin/rails assets:precompile

FROM ruby:2.5.3-alpine

# install rails require minimum package
RUN apk --update --no-cache add \
    shadow sudo busybox-suid \
    execline tzdata postgresql-dev openssl && \
    echo "Etc/UTC" > /etc/localtime

# for docker-compose
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Create the rebacklogs user
ARG UID=991
ARG GID=991
RUN apk update && \
  apk --update --no-cache add bash bash-completion tini && \
	addgroup --gid $GID rebacklogs && \
	useradd -m -u $UID -g $GID -d /opt/rebacklogs rebacklogs && \
	echo "rebacklogs:`head /dev/urandom | tr -dc A-Za-z0-9 | head -c 24 | mkpasswd -s -m sha-256`" | chpasswd

EXPOSE 3000

WORKDIR /opt/rebacklogs

# Copy gem and assets:precompile from builder image
COPY --chown=rebacklogs:rebacklogs --from=builder /opt/rebacklogs/vendor/bundle vendor/bundle
COPY --chown=rebacklogs:rebacklogs --from=builder /usr/local/bundle /usr/local/bundle

COPY --chown=rebacklogs:rebacklogs --from=builder /opt/rebacklogs/public/assets/ /opt/rebacklogs/public/assets/
COPY --chown=rebacklogs:rebacklogs --from=builder /opt/rebacklogs/public/packs/ /opt/rebacklogs/public/packs/

# Copy Re:Backlogs Source Code
COPY --chown=rebacklogs:rebacklogs . /opt/rebacklogs

# Tell rails to serve static files
ENV RAILS_ENV="production"
ENV RAILS_SERVE_STATIC_FILES="true"
ENV BIND="0.0.0.0"

# Set the run user
USER rebacklogs

# Set the work dir and the container entry point
ENTRYPOINT ["/sbin/tini", "--"]
