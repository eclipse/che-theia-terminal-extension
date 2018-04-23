#!/bin/bash

cd ..
./buildBinary.sh
cd machine-exec-server

docker build -t aandrienko/machine-exec:latest .
