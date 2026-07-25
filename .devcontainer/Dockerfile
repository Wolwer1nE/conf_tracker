FROM ruby:4.0-slim

# Install system dependencies for Rails + dev tools
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      build-essential \
      curl \
      git \
      libyaml-dev \
      pkg-config \
      sqlite3 \
      libsqlite3-dev \
      libvips \
      libjemalloc2 && \
    ln -s /usr/lib/$(uname -m)-linux-gnu/libjemalloc.so.2 /usr/local/lib/libjemalloc.so && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Install Node.js
ENV NODE_VERSION=22.13.1
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g yarn@1.22.22 && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Pre-create expected directories for Rails
RUN mkdir -p /workspace/storage /workspace/log /workspace/tmp/pids

# Set Rails environment
ENV RAILS_ENV=development \
    BUNDLE_PATH=/usr/local/bundle

# Create vscode user (matching devcontainer conventions)
RUN useradd -m -s /bin/bash vscode && \
    chown -R vscode:vscode /usr/local/bundle /workspace
