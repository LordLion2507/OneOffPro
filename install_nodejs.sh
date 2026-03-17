#!/usr/bin/env bash
set -euo pipefail

echo "[install_nodejs] Starting Node.js/NVM setup..."

NVM_VERSION="${NVM_VERSION:-v0.40.3}"
NODE_VERSION="${NODE_VERSION:-20}"
NVM_DIR="${NVM_DIR:-$HOME/.nvm}"

install_nvm() {
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    echo "[install_nodejs] NVM already present at $NVM_DIR"
    return
  fi

  echo "[install_nodejs] Installing NVM ${NVM_VERSION} ..."
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_VERSION}/install.sh" | bash
  elif command -v wget >/dev/null 2>&1; then
    wget -qO- "https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_VERSION}/install.sh" | bash
  else
    echo "[install_nodejs] ERROR: Neither curl nor wget is available."
    exit 1
  fi
}

load_nvm() {
  export NVM_DIR
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    # shellcheck disable=SC1090
    . "$NVM_DIR/nvm.sh"
  else
    echo "[install_nodejs] ERROR: nvm.sh not found at $NVM_DIR/nvm.sh"
    exit 1
  fi
}

install_nvm
load_nvm

echo "[install_nodejs] Installing Node.js version ${NODE_VERSION} ..."
nvm install "$NODE_VERSION"
nvm use "$NODE_VERSION"
nvm alias default "$NODE_VERSION"

echo "[install_nodejs] Verifying installation ..."
if ! command -v node >/dev/null 2>&1; then
  echo "[install_nodejs] ERROR: node not found in PATH."
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "[install_nodejs] ERROR: npm not found in PATH."
  exit 1
fi

echo "[install_nodejs] node: $(node -v)"
echo "[install_nodejs] npm : $(npm -v)"
echo "[install_nodejs] Setup completed."
