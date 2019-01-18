'use strict';

const RuntimeError = require('./runtime');

class InvalidAddress extends RuntimeError {
	constructor(value, cause) {
		super(
			`The provided value, '${value}', is not a valid IPv4 address`,
			'InvalidAddress',
			cause
		);
		this.value = value;
	}
}

module.exports = InvalidAddress;
