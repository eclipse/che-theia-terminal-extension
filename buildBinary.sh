#!/bin/bash

docker build -t eclipse/build-machine-exec-server .
docker run --rm -v ${PWD}/machine-exec-server:/go/bin eclipse/build-machine-exec-server