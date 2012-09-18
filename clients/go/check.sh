#!/bin/sh

packages="c4/game
c4/ai"

#format all packages
for p in $packages; do
    go fmt $p
done

#run all of the tests
for p in $packages; do
    go test $p
done

