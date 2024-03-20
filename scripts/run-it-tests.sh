#!/bin/bash

jest_cmd="jest"
extra_args=()

show_help() {
  local exit_code="${1:-0}"

  echo "usage: $0 [-d] [-t <PATTERN>]"
  echo
  echo "  -d : run in debug mode"
  echo "  -t <PATTERN> :  run only test that match provided pattern. See https://jestjs.io/docs/cli#--testnamepatternregex"
  echo

  exit $exit_code
}

while getopts ":dht:" opt
do
   case "$opt" in
      d ) jest_cmd="node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest" ;; # Debug
      t ) extra_args+=(-t "$OPTARG") ;; # Test pattern
      h ) show_help ;;
      * ) show_help 1 ;;
   esac
done

# Run infrastructure
docker compose -f local/docker-compose-infra-it-tests.yml up -d --build 

# Set env variables - scripts run in subshell so parent's context isn't modified
set -o allexport && source ./local/it-tests.env

# Run IT tests
$jest_cmd --config ./tests/it/jest-it.json --runInBand --color "${extra_args[@]}"
it_test_result_code=$?

# Cleanup
docker compose -f local/docker-compose-infra-it-tests.yml down --rmi "local" --volumes

# Return exit code for test-it job
exit "$it_test_result_code"
