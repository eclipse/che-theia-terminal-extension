#!/bin/bash

../buildBinary.sh
docker build -t aandrienko/machine-exec .
