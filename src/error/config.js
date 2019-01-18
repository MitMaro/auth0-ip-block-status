'use strict';

const RuntimeError = require('./runtime');

class ConfigError extends RuntimeError {
	constructor(path, value, expected, cause) {
		super(
			`The configuration path, ${path}, is expected to be ${expected} but the value is ${value}`,
			'ConfigError',
			cause
		);
		this.path = path;
		this.value = value;
		this.expected = expected;
	}
}

module.exports = ConfigError;
