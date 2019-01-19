'use strict';

const debug = require('debug')('auth0:filter-list-processor');
const net = require('net');
const ipAddr = require('ip6addr');
const mergeRanges = require('./merge-ranges');
const FilterListProcessError = require('../error/filter-list-process');

module.exports = (filterLists) => {
	// combine full list of ranges from all lists
	const ipAddressRanges = [];
	for (const name in filterLists) {
		debug('parsing list %s', name);
		const contents = filterLists[name];
		const countBefore = ipAddressRanges.length;
		for (const line of contents.split('\n')) {
			const ipRange = line.trim();
			if (ipRange === '' || ipRange.startsWith('#')) {
				continue;
			}

			// check for CIDR
			if (ipRange.includes('/')) {
				const parsedIPRange = ipAddr.createCIDR(ipRange);
				ipAddressRanges.push({
					start: parsedIPRange.address().toLong(),
					end: parsedIPRange.broadcast().toLong(),
					blocked: true,
					meta: {
						source: [name],
					},
				});
			}
			// handle non-CIDR IP address
			else {
				if (!net.isIPv4(ipRange)) {
					throw new FilterListProcessError(`Invalid IPv4 Address: ${line}`, name);
				}
				const parsedIPRange = ipAddr.parse(ipRange).toLong();
				ipAddressRanges.push({
					start: parsedIPRange,
					end: parsedIPRange,
					blocked: true,
					meta: {
						source: [name],
					},
				});
			}
		}
		debug('added %d ranges from %s', ipAddressRanges.length - countBefore, name);
	}
	debug('%d total ranges loaded from %d lists', ipAddressRanges.length, Object.keys(filterLists).length);

	if (ipAddressRanges.length === 0) {
		throw new FilterListProcessError('Filter lists contain no entries', Object.keys(filterLists).join(', '));
	}

	mergeRanges(ipAddressRanges);
	debug('%d total ranges after lists combined', ipAddressRanges.length);

	return ipAddressRanges;
};
