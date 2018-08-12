#! /bin/bash
set -e
# Set env vars from .env
set -o allexport; source .env; set +o allexport

TWITTER_CONSUMER_KEY=$TF_VAR_twitter_consumer_key \
TWITTER_CONSUMER_SECRET=$TF_VAR_twitter_consumer_secret \
TWITTER_ACCESS_TOKEN=$TF_VAR_twitter_access_token \
TWITTER_ACCESS_TOKEN_SECRET=$TF_VAR_twitter_access_token_secret \
webpack-dev-server --config ./app/webpack.config.ts --inline false --mode development