#!/bin/sh

# - git tag erstellen

yarn build

# - binaries pushen
# - npm version bumpen um binary bei testbuilds nicht zu überschreiben
#   der eigentliche release wäre dann das git tag
