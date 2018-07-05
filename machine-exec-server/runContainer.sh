#!/bin/bash
# Copyright (c) 2018 Red Hat, Inc.
# All rights reserved. This program and the accompanying materials
# are made available under the terms of the Eclipse Public License v1.0
# which accompanies this distribution, and is available at
# http://www.eclipse.org/legal/epl-v10.html

docker run --rm -p 4444:4444 -v /var/run/docker.sock:/var/run/docker.sock eclipse/machine-exec
