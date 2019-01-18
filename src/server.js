/* eslint-disable no-console */
'use strict';

const http = require('http');
const stoppable = require('stoppable');
const net = require('net');
const checkIpAddressBlockedConstructor = require('./check-address-blocked');

const checkIpAddressBlocked = checkIpAddressBlockedConstructor();

function httpResponseHandler(req, res) {
	if (req.method !== 'GET') {
		res.statusCode = 405;
		res.end();
		return;
	}

	const ipAddress = req.url.substr(1);

	if (!net.isIPv4(ipAddress)) {
		res.statusCode = 400;
		res.end('Invalid ip address provided');
		return;
	}

	const result = checkIpAddressBlocked(ipAddress);

	res.setHeader('Content-Type', 'application/json');
	res.write(JSON.stringify(result));
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
