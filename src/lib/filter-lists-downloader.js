'use strict';

const debug = require('debug')('auth0:filter-list-downloader');
const EventEmitter = require('events');
const http = require('http');
const https = require('https');
const {URL} = require('url');
const FileLocationError = require('../error/filter-list-download-error');

const EVENT_DOWNLOAD_ERROR = 'event-download-error';
const EVENT_START = 'event-start';
const EVENT_STOP = 'event-stop';
const EVENT_UPDATE_START = 'event-update-start';
const EVENT_UPDATE_COMPLETE = 'event-update-complete';
const EVENT_UPDATE_NO_CHANGE = 'event-update-no-change';

async function getRemoteLocation(location, etag) {
	debug('starting download of %s', location);
	return new Promise((resolve, reject) => {
		const get = location.protocol === 'http:' ? http.get : https.get;
		const headers = {};
		if (etag) {
			debug('using ETag %s for %s', etag, location);
			headers['If-None-Match'] = etag;
		}
		const options = new URL(location);
		options.headers = headers;
		const request = get(options, (res) => {
			const {statusCode, statusMessage} = res;

			if (statusCode === 304) {
				debug('received cached response for %s', location);
				return resolve(null);
			}

			if (statusCode !== 200) {
				debug('received invalid status %s [%d]', statusCode, statusMessage);
				res.resume();
				return reject(new FileLocationError(statusMessage, statusCode, location.toString()));
			}
			debug('received update for %s', location);

			res.setEncoding('utf8');
			const raw = [];
			res.on('data', (chunk) => raw.push(chunk));
			res.on('end', () => {
				const eTag = res.headers.etag;
				const data = raw.join('').toString();
				debug('%s received new ETag of %s', location, eTag);
				return resolve({
					data,
					eTag,
				});
			});
			return res;
		});
		request.on('error', (e) => {
			debug('request error occured for %s: %s', location, e.message);
			return reject(e);
		});
	});
}

class FilterListDownloader extends EventEmitter {
	constructor(filterLists, updateTime = 5 * 60 * 1000) {
		super();
		this.updateTime = updateTime;
		this._checkfiles = this._checkfiles.bind(this);
		this.filterLists = [];
		for (const name in filterLists) {
			this.addLocation(filterLists[name], name);
		}
		this.running = false;
		this.Event = FilterListDownloader.Event;
	}

	addLocation(location, name) {
		const url = new URL(location);
		this.filterLists.push({
			contents: '',
			filename: name,
			etag: '',
			url,
		});
		debug('location %s added with name %s', location, name);
	}

	async start() {
		if (this.timer) {
			this.stop();
		}
		this.emit(EVENT_START);
		await this._checkfiles();
		debug('starting downloader timer with interval %d ms', this.updateTime);
		this.timer = setInterval(this._checkfiles, this.updateTime);
		return undefined;
	}

	stop() {
		if (this.timer) {
			debug('stopping downloader timer');
			this.timer.unref();
			this.timer = clearInterval(this.timer);
			this.timer = null;
		}
		this.emit(EVENT_STOP);
	}

	getFilterLists() {
		const contents = {};
		for (const location of this.filterLists) {
			contents[location.filename] = location.contents;
		}
		return contents;
	}

	static async _downloadLocation(filterList) {
		const list = await getRemoteLocation(filterList.url, filterList.eTag);
		// null represents no change in content
		if (list !== null) {
			filterList.eTag = list.eTag;
			filterList.contents = list.data;
			return true;
		}
		return false;
	}

	async _checkfiles() {
		// avoid check overlaps
		this.emit(EVENT_UPDATE_START);
		if (this.running) {
			debug('existing update in progess, skipping update cycle');
			return undefined;
		}
		this.running = true;

		const tasks = [];

		for (const filterList of this.filterLists) {
			tasks.push(FilterListDownloader._downloadLocation(filterList));
		}

		debug('checking update of %d filter lists', tasks.length);

		try {
			const results = await Promise.all(tasks);
			this.running = false;
			if (results.some((r) => r)) {
				debug('a list was updated');
				this.emit(EVENT_UPDATE_COMPLETE, results, this.getFilterLists());
			}
			else {
				this.emit(EVENT_UPDATE_NO_CHANGE, results);
			}
			return results;
		}
		catch (err) {
			this.running = false;
			debug('an error occured during filter list download', err.message);
			this.emit(EVENT_DOWNLOAD_ERROR, err);
			throw err;
		}
	}
}

FilterListDownloader.Event = {
	DownloadError: EVENT_DOWNLOAD_ERROR,
	Start: EVENT_START,
	UpdateStart: EVENT_UPDATE_START,
	UpdateComplete: EVENT_UPDATE_COMPLETE,
	UpdateNoChange: EVENT_UPDATE_NO_CHANGE,
	Stop: EVENT_STOP,
};

module.exports = FilterListDownloader;
