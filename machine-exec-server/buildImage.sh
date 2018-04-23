#!/bin/bash

./compile.sh
docker build -t aandrienko/machine-exec .
