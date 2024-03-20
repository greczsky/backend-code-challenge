#!/bin/bash
# This script is used to clean up working directory
# and run locally all possible tests against LOCAL resources.
# It is recommended to run this script manually before merging to 'main' branch.
# Alternatively this script can be also used to clean-install workspace.

echo -e '\033[36m
Cleaning project and starting all possible \033[96m"LOCAL-to-LOCAL"\033[36m tests.
\033[0m'

# set -x

npm i && \
npm run format && \
npm run build && \
npm run test:cov -- --verbose --color --detectOpenHandles --passWithNoTests && \
docker-compose -f local/docker-compose-app.yml -f local/docker-compose-infra.yml down --rmi "local" --volumes && \
docker-compose -f local/docker-compose-infra.yml up -d --build && \
sleep 4 && \
. ./scripts/env/local/testInit.sh && \
npm run typeorm:local -- migration:run && \
npm run test:it -- --verbose --color --detectOpenHandles --passWithNoTests && \
docker-compose -f local/docker-compose-app.yml up -d --build && \
sleep 4 && \
npm run test:e2e -- --verbose --color --detectOpenHandles --passWithNoTests && \
docker-compose -f local/docker-compose-app.yml -f local/docker-compose-infra.yml down --rmi "local" --volumes && \
echo -e '\033[36m\nAll \033[96m"LOCAL-to-LOCAL"\033[36m tests passed. \n\033[0m'
