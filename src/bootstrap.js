'use strict';

const getConfig = require('./config');
const createCheckIpAddressBlocked = require('./lib/check-address-blocked');
const FilterListDownloader = require('./lib/filter-lists-downloader');
const serverSetup = require('./server');
const downloader = require('./downloader');

module.exports = () => {
	const config = getConfig();

	const filterListDownloader = new FilterListDownloader(config.filterLists, config.filterListUpdateInterval);
	const checkIpAddressBlocked = createCheckIpAddressBlocked();

	const system = {
		config,
		checkIpAddressBlocked,
		downloader: downloader(filterListDownloader, checkIpAddressBlocked),
		server: serverSetup(config, checkIpAddressBlocked),
	};
	return system;
};
