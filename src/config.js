/* eslint-disable no-process-env */
'use strict';

const ms = require('ms');
const ConfigError = require('./error/config');

function checkRequired(key, value) {
	if (value === undefined || value === '') {
		throw new ConfigError(key, 'undefined', 'required');
	}
}

function positiveInteger(key, defaultValue, required, allowZero = false) {
	const value = process.env[key] === undefined ? defaultValue : process.env[key];

	/* istanbul ignore else not used */
	if (required) {
		checkRequired(key, value);
	}

	/* istanbul ignore if not used */
	if (value === undefined) {
		return undefined;
	}

	const numericValue = Number(value);

	if (isNaN(numericValue)) {
		throw new ConfigError(key, `${value}`, 'an integer');
	}

	if (numericValue < 0 || (!allowZero && value === 0)) {
		throw new ConfigError(key, `${value}`, allowZero ? /* istanbul ignore next not used */ '>= 0' : '> 0');
	}

	return numericValue;
}

module.exports = function getConfig() {
	return {
		httpServer: {
			port: positiveInteger('PORT', '3000', true),
		},
		gRPCServer: {
			port: positiveInteger('GRPC_PORT', '3001', true),
		},
		filterLists: {
			/* eslint-disable camelcase */
			firehol_level1: 'https://iplists.firehol.org/files/firehol_level1.netset',
			firehol_level2: 'https://iplists.firehol.org/files/firehol_level2.netset',
			/* eslint-enable camelcase */
		},
		filterListUpdateInterval: positiveInteger('FILTER_LIST_UPDATE_INTERVAL', ms('5 minutes'), true),
	};
};
