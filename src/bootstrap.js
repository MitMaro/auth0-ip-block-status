'use strict';

const getConfig = require('./config');
const createCheckIpAddressBlocked = require('./lib/check-address-blocked');
const FilterListDownloader = require('./lib/filter-lists-downloader');
const httpServerSetup = require('./http-server');
const gRPCServerSetup = require('./grpc-server');
const downloader = require('./downloader');

module.exports = () => {
	const config = getConfig();

	const filterListDownloader = new FilterListDownloader(config.filterLists, config.filterListUpdateInterval);
	const checkIpAddressBlocked = createCheckIpAddressBlocked();

	const system = {
		config,
		checkIpAddressBlocked,
		downloader: downloader(filterListDownloader, checkIpAddressBlocked),
		gRPCServer: gRPCServerSetup(config, checkIpAddressBlocked),
		httpServer: httpServerSetup(config, checkIpAddressBlocked),
	};
	return system;
};
