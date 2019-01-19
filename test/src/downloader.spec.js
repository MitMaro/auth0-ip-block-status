/* eslint-disable no-process-env */
'use strict';

const sinon = require('sinon');
const nock = require('nock');
const getConfig = require('../../src/config');
const FilterListsDownloader = require('../../src/lib/filter-lists-downloader');
const createCheckAddressBlocked = require('../../src/lib/check-address-blocked');
const _createDownloader = require('../../src/downloader');

describe('Downloader', function () {
	it('should start and end the download service', async function () {
		nock('https://example.com')
			.get('/filter-list-1.netset')
			.reply(200, '0.0.0.0/8')
			.get('/filter-list-2.netset')
			.reply(200, '1.1.1.1/8');
		const config = getConfig();
		config.filterLists = {
			A: 'https://example.com/filter-list-1.netset',
			B: 'https://example.com/filter-list-2.netset',
		};
		const filterListsDownloader = new FilterListsDownloader(config.filterLists, config.filterListUpdateInterval);

		const checkIpAddressBlocked = createCheckAddressBlocked();
		const updateAddressesSpy = sinon.spy(checkIpAddressBlocked, 'updateAddresses');
		// this has to be created after Nock
		const clock = sinon.useFakeTimers();
		const app = _createDownloader(filterListsDownloader, checkIpAddressBlocked);

		try {
			await app.setup();
			await app.start();
			expect(updateAddressesSpy).to.have.been.calledWithExactly([
				{start: 0, end: 16777215, blocked: true, meta: {source: ['A']}},
				{start: 16777216, end: 33554431, blocked: true, meta: {source: ['B']}},
			]);
			await app.end();
		}
		finally {
			clock.reset();
			clock.restore();
			nock.cleanAll();
			app.end();
		}
	});
});
