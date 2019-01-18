'use strict';

class BaseError extends Error {
	constructor(message, type, cause) {
		super(message);

		this.message = message;
		this.name = this.constructor.name;
		this.type = type;
		this.cause = cause;
		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = BaseError;
