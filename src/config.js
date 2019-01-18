/* eslint-disable no-process-env */
'use strict';

const ConfigError = require('./error/config');

function checkRequired(key, value) {
	if (value === undefined) {
		throw new ConfigError(key, 'undefined', 'required');
	}
}

function positiveInteger(key, defaultValue, required = false, allowZero = false) {
	const value = process.env[key] === undefined ? defaultValue : process.env[key];

	if (required) {
		checkRequired(key, value);
	}

	if (value === undefined) {
		return undefined;
	}

	const numericValue = Number(value);

	if (isNaN(numericValue)) {
		throw new ConfigError(key, `${value}`, 'an integer');
	}

	if (numericValue < 0 || (!allowZero && value === 0)) {
		throw new ConfigError(key, `${value}`, allowZero ? '>= 0' : '> 0');
	}

	return numericValue;
}

module.exports = function getConfig() {
	return {
		server: {
			port: positiveInteger('PORT', '3000', true),
		},
	};
};
