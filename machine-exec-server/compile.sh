#!/bin/bash
# Copyright (c) 2018 Red Hat, Inc.
# All rights reserved. This program and the accompanying materials
# are made available under the terms of the Eclipse Public License v1.0
# which accompanies this distribution, and is available at
# http://www.eclipse.org/legal/epl-v10.html

echo "===>Begin build machine-exec-server binary<===";

function resolveDependencies() {
    echo "===>Resolve go-lang dependencies with help dep tool<===";
    dep ensure
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
