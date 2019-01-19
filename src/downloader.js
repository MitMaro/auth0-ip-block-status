'use strict';

const filterListProcessor = require('./lib/filter-list-processor');

module.exports = (filterListDownloader, checkIpAddressBlocked) => {
	return {
		async setup() {
			filterListDownloader.on(filterListDownloader.Event.UpdateComplete, (status, filterLists) => {
				const filterRanges = filterListProcessor(filterLists);
				checkIpAddressBlocked.updateAddresses(filterRanges);
			});
			/* istanbul ignore next nothing to test here */
			filterListDownloader.on(filterListDownloader.Event.DownloadError, (err) => {
				/* eslint-disable-next-line no-console */
				console.error(err);
			});
		},
		async start() {
			await filterListDownloader.start();
		},
		async end() {
			filterListDownloader.stop();
		},
	};
};
