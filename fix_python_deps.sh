#!/bin/bash

# Bypass Tools Suite - Fix Python Dependencies Script
# This script copies missing Python dependencies to the built Electron app

echo "🔧 Fixing Python dependencies for Bypass Tools Suite..."

# Find Python site-packages directory
PYTHON_SITE_PACKAGES=$(python3 -c "import site; print(site.getsitepackages()[0])")
echo "📦 Using Python packages from: $PYTHON_SITE_PACKAGES"

# Define the required dependencies
DEPENDENCIES=("requests" "urllib3" "certifi" "charset_normalizer" "idna" "colorama")

# Function to copy dependencies to a target directory
copy_dependencies() {
    local target_dir="$1"
    echo "📂 Copying dependencies to: $target_dir"
    
    for dep in "${DEPENDENCIES[@]}"; do
        if [ -d "$PYTHON_SITE_PACKAGES/$dep" ]; then
            echo "  ✅ Copying $dep..."
            cp -r "$PYTHON_SITE_PACKAGES/$dep" "$target_dir/"
        else
            echo "  ❌ Warning: $dep not found in $PYTHON_SITE_PACKAGES"
        fi
    done
}

# Fix the installed app in Applications
if [ -d "/Applications/Bypass Tools Suite.app/Contents/Resources/backend/" ]; then
    echo "🏠 Fixing installed app..."
    copy_dependencies "/Applications/Bypass Tools Suite.app/Contents/Resources/backend"
fi

# Fix the built apps in dist directory
if [ -d "dist/mac/Bypass Tools Suite.app/Contents/Resources/backend/" ]; then
    echo "💻 Fixing x64 build..."
    copy_dependencies "dist/mac/Bypass Tools Suite.app/Contents/Resources/backend"
fi

if [ -d "dist/mac-arm64/Bypass Tools Suite.app/Contents/Resources/backend/" ]; then
    echo "🚀 Fixing ARM64 build..."
    copy_dependencies "dist/mac-arm64/Bypass Tools Suite.app/Contents/Resources/backend"
fi

echo "✅ All Python dependencies have been fixed!"
echo "🎉 The Bypass Tools Suite should now work properly."
