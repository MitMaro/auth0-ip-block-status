'use strict';

const RuntimeError = require('./runtime');

class FilterListProcessError extends RuntimeError {
	constructor(reason, listName, cause) {
		super(
			`Error while process filter list '${listName}': ${reason}`,
			'FilterListProcessError',
			cause
		);
		this.reason = reason;
		this.listName = listName;
	}
}

module.exports = FilterListProcessError;
