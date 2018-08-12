#! /bin/bash
set -e

# Set env vars from .env
set -o allexport; source .env; set +o allexport

# Deploy the current branch's backend and infrastructure.
dir=infrastructure/env-$BRANCH
if [[ -d "$dir" ]]; then
  echo "Deploying $BRANCH backend..."
  cd infrastructure/env-$BRANCH
  terraform apply -auto-approve terraform.plan
  cd ../.. 
else 
  echo "Skipping backend because $dir does not exist."
fi