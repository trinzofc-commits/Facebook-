#!/bin/bash

# Đăng nhập Expo bằng token (không cần interactive)
echo "Logging in to Expo..."
eas login --username facebookclone2025 --password "FacebookClone@2025" 2>&1 || true

# Build APK
echo "Building APK..."
eas build --platform android --type apk --non-interactive 2>&1

