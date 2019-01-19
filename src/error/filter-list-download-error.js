'use strict';

const RuntimeError = require('./runtime');

class FilterListDownloadError extends RuntimeError {
	constructor(reason, code, location, cause) {
		super(
			`The location, '${location}', failed to download: ${reason} [${code}]`,
			'FilterListDownloadError',
			cause
		);
		this.code = code;
		this.location = location;
		this.reason = reason;
	}
}

module.exports = FilterListDownloadError;
