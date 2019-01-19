/* eslint-disable no-console */
'use strict';

const http = require('http');
const stoppable = require('stoppable');
const httpResponseHandler = require('./lib/http-response-handler');

module.exports = (config, checkIpAddressBlocked) => {
	let server;
	return {
		async setup() {
			server = stoppable(http.createServer(httpResponseHandler(checkIpAddressBlocked)));
			return server;
		},
		async start() {
			if (server === undefined) {
				throw new Error('Attempted to call `start` before `setup` was called.');
			}
			return new Promise((resolve, reject) => {
				// eslint-disable-next-line promise/prefer-await-to-callbacks
				server.on('error', (err) => {
					return reject(err);
				});
				server.listen(config.server.port, () => {
					console.log(`Server listening on port ${server.address().port}`);
					return resolve();
				});
			});
		},
		async end() {
			return new Promise((resolve) => {
				if (server === undefined) {
					// nothing to do
					return resolve();
				}
				server.stop(() => resolve());
				return undefined;
			});
		},
	};
};
