#!/bin/sh
if [ 1 -ne $# ]; then
    echo 'exactly one argument - the game id - is required'
    exit 187
fi

curl http://localhost:3000/game/state/$1
echo
