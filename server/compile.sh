#!/bin/bash

function resolveDependencies() {
    echo "Resolve dependencies"
    go get
      if [ $? != 0 ]; then
        echo "Failed to resolve dependencies";
        exit 0;
    fi
}

function compile() {
    resolveDependencies

    echo "Compile binary from source code."

    $(CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .)

    if [ $? != 0 ]; then
        echo "Failed to compile code";
        exit 0;
    fi
}

compile
