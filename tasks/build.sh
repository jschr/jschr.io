#! /bin/bash
set -e
# Set env vars from .env
set -o allexport; source .env; set +o allexport

yarn rimraf build 
yarn tsc
