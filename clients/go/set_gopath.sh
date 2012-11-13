#!/bin/sh

wd=`pwd`
sep=""
if [ -n "$GOPATH" ]; then
    sep=":"
fi

echo export GOPATH="${GOPATH}${sep}${wd}"

