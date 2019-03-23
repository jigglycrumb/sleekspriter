#!/bin/sh

appname=$(basename $(pwd))

tmux new-session -A -s ${appname} \; \
split-window -v \; \
send-keys 'yarn test:watch' C-m \; \
select-pane -t 1 \; \
split-window -h \; \
select-pane -t 1 \; \
send-keys -t 2 'yarn start' C-m \;
