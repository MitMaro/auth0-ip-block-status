#!/usr/bin/env bash

cd "$(dirname "${BASH_SOURCE[0]}")" && source "./common.bash"
task="${1-}"
shift 1 || true

case "$task" in
	':unit') mocha "$@";;
	':coverage'|':unit:coverage') nyc mocha "$@" ;;
	''|':all') nyc mocha "$@" ;;
	*) fatal "Invalid test target $task" "$EXIT_CODE_INVALID_STATE" ;;
esac
