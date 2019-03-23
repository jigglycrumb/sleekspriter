#!/bin/sh

target_folder="./docs/app"

echo ""
echo "-------------------------------------------"
echo "Updating Github page build"
echo "-------------------------------------------"

echo "Cleaning up docs folder"
rm -rf $target_folder

echo "Copying app to docs folder"
cp -R ./build/browser $target_folder

# TODO remove when logo is somewhat final
echo "Copying logo to docs folder"
cp ./src/assets/logo@x4.png ./docs/assets

echo "Done"
