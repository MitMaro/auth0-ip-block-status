#!/usr/bin/env bash

cd "$(dirname "${BASH_SOURCE[0]}")" && source "./common.bash"

ensure-directory "build/"

if yn "${WATCH:-}"; then
	info "Starting watch; use $(hl "ctrl-c") to exit"
	chokidar \
		'package.json' \
		'src/**/*.js' \
		--initial \
		--silent \
		--debounce 750 \
		-c 'WATCH=false ./scripts/start.bash'
else
	process-run "node $@ src/start.js" "service" 'build/'
fi
