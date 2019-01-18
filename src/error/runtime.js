'use strict';

const BaseError = require('./base');

class RuntimeError extends BaseError {
	constructor(message, type, cause) {
		/* eslint-disable no-param-reassign */
		if (type === undefined) {
			type = 'RuntimeError';
		}
		else if (type instanceof Error) {
			cause = type;
			type = 'RuntimeError';
		}
		/* eslint-enable no-param-reassign */
		super(message, type, cause);
	}
}

module.exports = RuntimeError;
