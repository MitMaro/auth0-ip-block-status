'use strict';

const nock = require('nock');
const sinon = require('sinon');

const FilterListDownloader = require('../../../src/lib/filter-lists-downloader');

const filterList = 'https://example.com/filter-list.netset';

describe('/src/lib/filter-list-downloader', function () {
	let clock;

	afterEach(function () {
		if (clock) {
			clock.reset();
			clock.restore();
			clock = null;
		}
		nock.cleanAll();
	});

	it('should download filter list over https', async function () {
		nock('https://example.com')
			.get('/filter-list.netset')
			.reply(200, '0.0.0.0/8', {
				etag: 'eeeeeeee',
			});
		const filterListDownloader = new FilterListDownloader({
			name: filterList,
		});

		try {
			await filterListDownloader.start();
			expect(filterListDownloader.getFilterLists()).to.deep.equal({
				name: '0.0.0.0/8',
			});
		}
		finally {
			filterListDownloader.stop();
		}
	});

	it('should download filter list over http', async function () {
		nock('http://example.com')
			.get('/filter-list.netset')
			.reply(200, '0.0.0.0/8', {
				etag: 'eeeeeeee',
			});
		const filterListDownloader = new FilterListDownloader({
			name: 'http://example.com/filter-list.netset',
		});

		try {
			await filterListDownloader.start();
			expect(filterListDownloader.getFilterLists()).to.deep.equal({
				name: '0.0.0.0/8',
			});
		}
		finally {
			filterListDownloader.stop();
		}
	});

	it('should download mulitple filter lists', async function () {
		nock('https://example.com')
			.get('/filter-list-1.netset')
			.reply(200, '0.0.0.0/8', {
				etag: 'eeeeeeee',
			})
			.get('/filter-list-2.netset')
			.reply(200, '1.1.1.1/8', {
				etag: 'fffffff',
			});
		const filterListDownloader = new FilterListDownloader({
			A: 'https://example.com/filter-list-1.netset',
			B: 'https://example.com/filter-list-2.netset',
		});

		try {
			await filterListDownloader.start();
			expect(filterListDownloader.getFilterLists()).to.deep.equal({
				A: '0.0.0.0/8',
				B: '1.1.1.1/8',
			});
		}
		finally {
			filterListDownloader.stop();
		}
	});
	it('should call start event on start of timer', async function () {
		nock('https://example.com')
			.get('/filter-list.netset')
			.reply(200, '0.0.0.0/8', {
				etag: 'eeeeeeee',
			});
		const filterListDownloader = new FilterListDownloader({
			name: filterList,
		});

		const p = new Promise((resolve) => {
			filterListDownloader.on(filterListDownloader.Event.Start, () => {
				resolve();
			});
		});
		try {
			await filterListDownloader.start();
		}
		finally {
			filterListDownloader.stop();
		}
		return p;
	});

	it('should call stop event on stop of timer', async function () {
		nock('https://example.com')
			.get('/filter-list.netset')
			.reply(200, '0.0.0.0/8', {
				etag: 'eeeeeeee',
			});
		const filterListDownloader = new FilterListDownloader({
			name: filterList,
		});

		const p = new Promise((resolve) => {
			filterListDownloader.on(filterListDownloader.Event.Stop, () => {
				resolve();
			});
		});
		filterListDownloader.stop();
		return p;
	});

	it('should stop previous timer on second start call', async function () {
		nock('https://example.com')
			.get('/filter-list.netset')
			.times(2)
			.reply(200, '0.0.0.0/8', {
				etag: 'eeeeeeee',
			});
		const filterListDownloader = new FilterListDownloader({
			name: filterList,
		});

		const p = new Promise((resolve) => {
			filterListDownloader.on(filterListDownloader.Event.Stop, () => {
				resolve();
			});
		});
		try {
			await filterListDownloader.start();
			await filterListDownloader.start();
			return p;
		}
		finally {
			filterListDownloader.stop();
		}
	});

	it('should call start update event on start of filter list update', async function () {
		nock('https://example.com')
			.get('/filter-list.netset')
			.reply(200, '0.0.0.0/8', {
				etag: 'eeeeeeee',
			});
		const filterListDownloader = new FilterListDownloader({
			name: filterList,
		});

		const p = new Promise((resolve) => {
			filterListDownloader.on(filterListDownloader.Event.UpdateStart, () => {
				resolve();
			});
		});
		try {
			await filterListDownloader.start();
		}
		finally {
			filterListDownloader.stop();
		}
		return p;
	});

	it('should call update event on complete download of filter list', async function () {
		nock('https://example.com')
			.get('/filter-list.netset')
			.reply(200, '0.0.0.0/8', {
				etag: 'eeeeeeee',
			});
		const filterListDownloader = new FilterListDownloader({
			name: filterList,
		});

		const p = new Promise((resolve) => {
			filterListDownloader.on(filterListDownloader.Event.UpdateComplete, () => {
				expect(filterListDownloader.getFilterLists()).to.deep.equal({
					name: '0.0.0.0/8',
				});
				resolve();
			});
		});
		try {
			await filterListDownloader.start();
		}
		finally {
			filterListDownloader.stop();
		}
		return p;
	});

	it('should use cached version', async function () {
		nock('https://example.com')
			.get('/filter-list.netset')
			.reply(200, '0.0.0.0/8', {
				etag: 'eeeeeeee',
			})
			.get('/filter-list.netset')
			.reply(304, '', {
				etag: 'eeeeeeee',
			});
		clock = sinon.useFakeTimers();
		const filterListDownloader = new FilterListDownloader({
			name: filterList,
		});

		const p = new Promise((resolve) => {
			filterListDownloader.on(filterListDownloader.Event.UpdateNoChange, (results) => {
				expect(results).to.deep.equal([false]);
				resolve();
			});
		});

		try {
			await filterListDownloader.start();
			clock.next();
		}
		finally {
			filterListDownloader.stop();
		}
		return p;
	});

	it('should not trigger download while download is in progress', async function () {
		// this is kinda hard to test due to Nock and Sinon Timer interactions, this test is not perfect
		// it depends on Nock failing on a third http request and Sinon's mocker timers being faster than Nock - Tim
		nock('https://example.com')
			.get('/filter-list.netset')
			.times(2)
			// .delayBody(500)
			.reply(200, '0.0.0.0/8', {
				etag: 'eeeeeeee',
			});
		clock = sinon.useFakeTimers();
		const filterListDownloader = new FilterListDownloader({
			name: filterList,
		});

		let counter = 1;
		const p = new Promise((resolve) => {
			// this even must be called twice for the test to pass
			filterListDownloader.on(filterListDownloader.Event.UpdateStart, () => {
				if (counter > 2) {
					resolve();
				}
				counter++;
			});
		});
		try {
			await filterListDownloader.start();
			clock.next();
			clock.next(); // trigger a second update as soon as possible
		}
		finally {
			filterListDownloader.stop();
		}
		return p;
	});

	it('should handle response error', async function () {
		nock('https://example.com')
			.get('/filter-list.netset')
			.reply(500);
		const filterListDownloader = new FilterListDownloader({
			name: filterList,
		});

		const p = new Promise((resolve) => {
			filterListDownloader.on(filterListDownloader.Event.DownloadError, () => {
				resolve();
			});
		});

		try {
			await expect(filterListDownloader.start()).to.be.rejectedWith(
				'The location, \'https://example.com/filter-list.netset\', failed to download: null [500]'
			);
		}
		finally {
			filterListDownloader.stop();
		}
		await p;
	});

	it('should handle request error', async function () {
		nock('https://example.com')
			.get('/filter-list.netset')
			.replyWithError({
				message: 'Error!',
				code: '500',
			});
		const filterListDownloader = new FilterListDownloader({
			name: filterList,
		});

		const p = new Promise((resolve) => {
			filterListDownloader.on(filterListDownloader.Event.DownloadError, () => {
				resolve();
			});
		});

		try {
			await expect(filterListDownloader.start()).to.be.rejectedWith(
				'Error!'
			);
		}
		finally {
			filterListDownloader.stop();
		}
		await p;
	});
});
