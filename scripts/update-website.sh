#!/bin/sh

WD=$(pwd)

# GITHUB_REF="refs/tags/test-release-3"

PRODUCT_VERSION="$(echo $GITHUB_REF | cut -d'/' -f3)"

# PRODUCT_VERSION="$(cut -d'/' -f3 <<<"$GITHUB_REF")"

echo "Updating website for SleekSpriter $PRODUCT_VERSION"

# cp -R $WD/website/* $WD/docs

# TODO fallback to currently set version (read from docs or so) and set it

# sed "s/%VERSION%/$PRODUCT_VERSION/g" website/index.html >docs/index.html
