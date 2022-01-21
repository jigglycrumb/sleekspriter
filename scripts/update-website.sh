#!/bin/bash

# manual usage:
# ./update-website.sh v0.1.2

WD=$(pwd)

# GITHUB_REF="refs/tags/vtest-release-3"

if [ $1 ]; then
  TAG=$1
else
  vTAG="$(echo $GITHUB_REF | cut -d'/' -f3)"
  echo "vTAG: $vTAG"
  TAG="${vTAG:1}"
fi

PRODUCT_VERSION=$TAG

echo "Updating website for SleekSpriter $PRODUCT_VERSION"

cp -R $WD/website/* $WD/docs

# TODO fallback to currently set version (read from docs or so) and set it

sed "s/%VERSION%/$PRODUCT_VERSION/g" website/index.html >docs/index.html

# commit everything
git config --global user.email "thesquidpeople@gmail.com"
git config --global user.name "hpcodecraft"

git add -A
git commit -m "Website build - v$PRODUCT_VERSION"
git push origin HEAD:master
