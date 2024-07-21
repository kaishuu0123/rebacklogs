FROM mcr.microsoft.com/devcontainers/base:ubuntu

ENV BUNDLER_VERSION 2.5.7

RUN apt -y update && apt -y upgrade && apt -y install libpq-dev

RUN gem install bundler --version ${BUNDLER_VERSION}
