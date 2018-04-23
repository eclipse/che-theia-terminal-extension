#!/bin/bash

echo "===>Begin build machine-exec-server binary<===";

function resolveDependencies() {
    echo "===>Resolve go-lang dependencies<===";
    go get
      if [ $? != 0 ]; then
        echo "Failed to resolve dependencies";
        exit 0;
    fi
}

function compile() {
    resolveDependencies;

    echo "===>Compile machine-exec-server binary from source code.<===";

    $(CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o machine-exec-server .);

    if [ $? != 0 ]; then
        echo "Failed to compile code";
        exit 0;
    fi

    echo "============Compilation succesfully completed.============";
}

compile;