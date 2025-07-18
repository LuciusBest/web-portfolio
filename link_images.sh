#!/usr/bin/env bash

set -e

LINK="assets"
TARGET="../Local_Site_Images"

if [ -L "$LINK" ]; then
    echo "Symlink '$LINK' already exists."
    exit 0
fi

if [ -e "$LINK" ]; then
    echo "Error: '$LINK' already exists and is not a symlink." >&2
    exit 1
fi

ln -s "$TARGET" "$LINK"
echo "Created symlink '$LINK' -> '$TARGET'"

