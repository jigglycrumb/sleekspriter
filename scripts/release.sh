#!/bin/sh

WD=$(pwd)
PUBLIC_REPO="../sleekspriter"

# get product name
PRODUCT_NAME=$(node -p -e "require('./package.json').productName")

# get current package version
PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

echo ""
echo "-------------------------------------------"
echo "Preparing release of $PRODUCT_NAME ($PACKAGE_VERSION)"
echo "-------------------------------------------"

# build
echo "Running build"
yarn build

# create git tag and push it
echo "Creating tag $PACKAGE_VERSION"
git tag $PACKAGE_VERSION && git push --tags

# switch to public repo
cd $PUBLIC_REPO

# update homepage with latest build
echo "Updating public homepage"
cp -R $WD/docs .

# copy changelog to public repo
# echo "Updating public change log"
# [TODO]

# commit changelog
# [TODO]

# commit everything
git commit -am "v$PACKAGE_VERSION"

# # create tag in public repo
# # git tag $PACKAGE_VERSION && git push --tags

# open browser with prefilled release form
open "https://github.com/hpcodecraft/sleekspriter/releases/new?tag=v$PACKAGE_VERSION&title=$PRODUCT_NAME+$PACKAGE_VERSION"

# switch back to private repo
cd $WD

# bump package version for the next release
echo "Bumping version for next release"
yarn version
