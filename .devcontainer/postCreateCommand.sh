#!/bin/bash
set -e

# Install bundler
gem install bundler --version 4.0.8

# Fix .claude directory ownership and install Claude Code
sudo chown -R vscode:vscode /home/vscode/.claude
curl -fsSL https://claude.ai/install.sh | bash
