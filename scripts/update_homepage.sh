#!/bin/sh
echo "Copying app to docs folder"
cp ./dist/* ./docs/app/
echo "Copying logo to docs folder"
cp ./src/assets/logo@x4.png ./docs/assets
echo "Done"
