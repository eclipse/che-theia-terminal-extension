#!/bin/bash

cd ..
./buildBinary.sh
cd machine-exec-server

docker build -t eclipse/machine-exec:latest .
