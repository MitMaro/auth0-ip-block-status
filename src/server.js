/* eslint-disable no-console */
'use strict';

const http = require('http');
const stoppable = require('stoppable');

function httpResponseHandler(req, res) {
	res.write('OK');
	res.end();
}

module.exports = (config) => {
	let server;
	return {
		async setup() {
			server = stoppable(http.createServer(httpResponseHandler));
		},
		async start() {
			if (server === undefined) {
				throw new Error('Attempted to call `start` before `setup` was called.');
			}
			return new Promise((resolve, reject) => {
				// eslint-disable-next-line promise/prefer-await-to-callbacks
				server.listen(config.server.port, (err) => {
					if (err) {
						return reject(err);
					}
					console.log(`Server listening on port ${server.address().port}`);
					return resolve();
				});
			});
		},
		async end() {
			if (server === undefined) {
				throw new Error('Attempted to call `start` before `setup` was called.');
			}
			return new Promise((resolve) => {
				if (server === undefined) {
					return resolve();
				}
				server.stop(() => resolve());
				return undefined;
			});
		},
	};
};
