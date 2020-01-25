#!/bin/sh

WD=$(pwd)
PUBLIC_REPO="../sleekspriter"

# get current package version
PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

# create git tag and push it
# git tag $PACKAGE_VERSION && git push --tags

# build
yarn build

# switch to public repo
# cd $PUBLIC_REPO

# copy changelog to public repo
# [TODO]

# commit changelog
# [TODO]

# create tag in public repo
# git tag $PACKAGE_VERSION && git push --tags

# open browser with prefilled release form
# open "https://github.com/hpcodecraft/sleekspriter/releases/new?tag=$PACKAGE_VERSION&title=SleekSpriter+$PACKAGE_VERSION"

# switch back to private repo
# cd $WD

# bump package version for the next release
# yarn version
