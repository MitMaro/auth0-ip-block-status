'use strict';

const getConfig = require('./config');
const createCheckIpAddressBlocked = require('./lib/check-address-blocked');
const serverSetup = require('./server');

module.exports = () => {
	const config = getConfig();

	const checkIpAddressBlocked = createCheckIpAddressBlocked();

	const system = {
		config,
		checkIpAddressBlocked,
		server: serverSetup(config, checkIpAddressBlocked),
	};
	return system;
};
