'use strict';

const bootstrap = require('../../src/bootstrap');

describe('/src/bootstrap', function () {
	it('should successfully bootstrap', function () {
		expect(bootstrap()).to.not.throw;
	});
});
