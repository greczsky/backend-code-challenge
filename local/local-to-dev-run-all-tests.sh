#!/bin/bash
# This script is used to clean up working directory
# and run locally all possible tests against DEV resources.
# It is recommended to run this script manually before merging to 'main' branch.
# Alternatively this script can be also used to clean-install workspace.
#
# First parameter of script is name of the stack (feature branch).
# When first parameter is ommitted, tests are ran against main branch.

echo -e '\033[36m
Cleaning project and starting all possible \033[96m"LOCAL-to-DEV"\033[36m tests.
\033[0m'

# set -x

npm i && \
npm run format && \
npm run build && \
. ./scripts/env/dev/testInit.sh $1 && \
npm run test:it -- --verbose --color --detectOpenHandles --passWithNoTests && \
npm run test:e2e -- --verbose --color --detectOpenHandles --passWithNoTests && \
echo -e '\033[36m\nAll \033[96m"LOCAL-to-DEV"\033[36m tests passed. \n\033[0m'
