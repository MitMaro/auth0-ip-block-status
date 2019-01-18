'use strict';

const net = require('net');
const ipAddr = require('ip6addr');
const InvalidAddress = require('./error/invalid-address');

const addresses = [
	{start: 0, end: 3232235875, blocked: false, meta: {}}, // 0.0.0.0 - 192.168.1.99
	{start: 3232235876, end: 3232236030, blocked: true, meta: {source: 'null-list'}}, // 192.168.1.100-255
	{start: 3232236031, end: 3232236543, blocked: false, meta: {}}, // 192.168.2.0 - 192.168.3.255
	{start: 3232236544, end: 3232236545, blocked: true, meta: {source: 'null-list'}}, // 192.168.4.0-1
	{start: 3232236546, end: 3232236927, blocked: false, meta: {}}, // 192.168.3.255 - 192.168.5.127
	{start: 3232236928, end: 3232236928, blocked: true, meta: {source: 'null-list'}}, // 192.168.5.128
	{start: 3232236929, end: 4294967295, blocked: false, meta: {}}, // 192.168.5.129 - 255.255.255.255
];

module.exports = () => {
	return (address) => {
		if (!net.isIPv4(address)) {
			throw new InvalidAddress(address);
		}

		const addressNumber = ipAddr.parse(address).toLong();

		// TODO replace with bianry search
		const result = addresses.find((range) => addressNumber >= range.start && addressNumber <= range.end);
		if (result.blocked) {
			return {
				status: true,
				source: result.meta.source,
			};
		}
		return {
			status: false,
		};
	};
};
