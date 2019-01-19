'use strict';

const {status: {INTERNAL}} = require('grpc');
const RuntimeError = require('./runtime');

class InvalidAddress extends RuntimeError {
	constructor(value, cause) {
		super(
			`The provided value, '${value}', is not a valid IPv4 address`,
			'InvalidAddress',
			cause
		);
		this.value = value;
		this.code = 400;
		this.status = INTERNAL;
	}
}

module.exports = InvalidAddress;
