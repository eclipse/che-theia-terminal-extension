#!/bin/bash

docker run -p 4444:4444 -v /var/run/docker.sock:/var/run/docker.sock aandrienko/machine-exec
