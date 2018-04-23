#!/bin/bash

$(go fmt ./...)

if [ $? != 0 ]; then
    "Failed to format code";
    exit 0;
fi
