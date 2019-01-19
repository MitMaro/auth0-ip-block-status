'use strict';

const {callbackify} = require('util');

module.exports = (checkIpAddressBlocked) => {
	async function query(call) {
		return checkIpAddressBlocked.match(call.request.ipAddress);
	}

	return {
		query: callbackify(query),
	};
};
