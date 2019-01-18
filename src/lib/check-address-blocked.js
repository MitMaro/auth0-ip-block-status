'use strict';

const ipAddr = require('ip6addr');
const net = require('net');
const binarySearch = require('./binary-search');
const InvalidAddress = require('../error/invalid-address');

module.exports = () => {
	let addresses = [];

	return {
		updateAddresses(newAddresses) {
			addresses = newAddresses;
		},
		match(address) {
			if (!net.isIPv4(address)) {
				throw new InvalidAddress(address);
			}

			const addressNumber = ipAddr.parse(address).toLong();

			const result = binarySearch(addresses, addressNumber);
			// const result = addresses.find((a) => a.start >= addressNumber && a.end <= addressNumber);
			if (result && result.blocked) {
				return {
					blocked: true,
					source: result.meta.source,
				};
			}
			return {
				blocked: false,
			};
		},
	};
};
