#!/bin/bash

# Deployment script for underbot3_frontend
# Features: conditional pnpm install, colored output, git fetch, and build

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emoji indicators
ROCKET="🚀"
PACKAGE="📦"
CHECK="✅"
WARNING="⚠️"
ERROR="❌"
INFO="ℹ️"
BUILD="🔨"

# Logging functions
log_info() {
    echo -e "${BLUE}${INFO} $1${NC}"
}

log_success() {
    echo -e "${GREEN}${CHECK} $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}${WARNING} $1${NC}"
}

log_error() {
    echo -e "${RED}${ERROR} $1${NC}"
}

log_step() {
    echo -e "${PURPLE}$1${NC}"
}

log_build() {
    echo -e "${CYAN}${BUILD} $1${NC}"
}

# Start deployment
echo -e "${GREEN}${ROCKET} Starting deployment process...${NC}"

# Step 1: Fetch latest changes from origin main
log_step "Step 1: Fetching latest changes from origin main"
git fetch origin main
git reset FETCH_HEAD --hard
log_success "Latest changes fetched successfully"

# Step 2: Check if we need to install dependencies
log_step "Step 2: Checking for dependency changes"

# Check if package.json or pnpm-lock.yaml has changed
if [ -f "package.json" ] && [ -f "pnpm-lock.yaml" ]; then
    # Get the hash of package.json and pnpm-lock.yaml
    CURRENT_DEPS_HASH=$(cat package.json pnpm-lock.yaml | sha256sum | cut -d' ' -f1)
    DEPS_HASH_FILE=".deps_hash"
    
    NEED_INSTALL=false
    
    if [ -f "$DEPS_HASH_FILE" ]; then
        SAVED_DEPS_HASH=$(cat "$DEPS_HASH_FILE")
        if [ "$CURRENT_DEPS_HASH" != "$SAVED_DEPS_HASH" ]; then
            log_info "Dependencies have changed"
            NEED_INSTALL=true
        else
            log_success "Dependencies are up to date"
        fi
    else
        log_info "No dependency hash found, installing dependencies"
        NEED_INSTALL=true
    fi
    
    if [ "$NEED_INSTALL" = true ]; then
        log_build "Installing dependencies with pnpm..."
        pnpm install
        echo "$CURRENT_DEPS_HASH" > "$DEPS_HASH_FILE"
        log_success "Dependencies installed successfully"
    fi
else
    log_warning "package.json or pnpm-lock.yaml not found, installing dependencies anyway"
    pnpm install
fi

# Step 3: Build the project
log_step "Step 3: Building the project"
log_build "Running pnpm build..."

if pnpm build; then
    log_success "Build completed successfully"
else
    log_error "Build failed!"
    exit 1
fi

# Step 4: Deployment summary
log_step "Step 4: Deployment summary"
echo -e "${GREEN}${ROCKET} Deployment completed successfully!${NC}"
echo -e "${BLUE}${INFO} Build artifacts are ready in the dist/ directory${NC}"

# Optional: Show build size if dist directory exists
if [ -d "dist" ]; then
    BUILD_SIZE=$(du -sh dist | cut -f1)
    echo -e "${CYAN}${PACKAGE} Build size: $BUILD_SIZE${NC}"
fi

echo -e "${GREEN}${CHECK} Ready to deploy! 🎉${NC}"
