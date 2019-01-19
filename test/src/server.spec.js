/* eslint-disable no-process-env */
'use strict';

const http = require('http');
const sinon = require('sinon');
const getConfig = require('../../src/config');
const createCheckAddressBlocked = require('../../src/lib/check-address-blocked');
const _createServer = require('../../src/server');

describe('HTTP server', function () {
	function createServer(checkIpAddressBlocked = createCheckAddressBlocked()) {
		return _createServer(getConfig(), checkIpAddressBlocked);
	}

	it('should create a HTTP server', async function () {
		const app = createServer();
		const server = await app.setup();
		expect(server).to.be.instanceOf(http.Server);
	});

	it('should shutdown even if not started', async function () {
		const app = createServer();
		return expect(await app.end()).to.be.undefined;
	});

	it('should listen on provided HTTP port', async function () {
		process.env.PORT = 13333;
		const app = createServer();
		const server = await app.setup();
		try {
			await app.start();
			expect(server.address().port).to.equal(13333);
		}
		finally {
			await app.end();
		}
	});

	it('should respond to valid HTTP request', async function () {
		const app = createServer();
		const server = await app.setup();
		try {
			await app.start();
			const res = await chai.request(server)
				.get('/1.1.1.1')
				.set('content-type', 'application/json');
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body.blocked).to.be.false;
		}
		finally {
			await app.end();
		}
	});

	it('should respond to /healthcheck', async function () {
		const app = createServer();
		const server = await app.setup();
		try {
			await app.start();
			const res = await chai.request(server)
				.get('/healthcheck')
				.set('content-type', 'application/json');
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body).to.have.property('time');
			expect(res.body).to.have.property('filterListCount');
			expect(res.body).to.have.property('lastUpdate');
		}
		finally {
			await app.end();
		}
	});

	it('should respond with 405 on non-GET method', async function () {
		const app = createServer();
		const server = await app.setup();
		try {
			await app.start();
			const res = await chai.request(server)
				.put('/1.1.1.1')
				.set('content-type', 'application/json');
			expect(res).to.have.status(405);
			expect(res).to.be.json;
		}
		finally {
			await app.end();
		}
	});

	it('should respond with 400 on invalid IP adddress', async function () {
		const app = createServer();
		const server = await app.setup();
		try {
			await app.start();
			const res = await chai.request(server)
				.get('/999.999.999.999')
				.set('content-type', 'application/json');
			expect(res).to.have.status(400);
			expect(res).to.be.json;
			expect(res.body.error).to.equal('The provided value, \'999.999.999.999\', is not a valid IPv4 address');
		}
		finally {
			await app.end();
		}
	});

	it('should respond with 500 on other error', async function () {
		const checkIpAddressBlocked = {
			match: sinon.stub().throws(new Error('An internal error')),
		};
		const app = createServer(checkIpAddressBlocked);
		const server = await app.setup();
		try {
			await app.start();
			const res = await chai.request(server)
				.get('/1.1.1.1')
				.set('content-type', 'application/json');
			expect(res).to.have.status(500);
			expect(res).to.be.json;
			expect(res.body.error).to.equal('An internal error');
		}
		finally {
			await app.end();
		}
	});

	it('should error if start is called before setup', async function () {
		const app = createServer();
		try {
			return expect(app.start()).to.be.rejectedWith('Attempted to call `start` before `setup` was called.');
		}
		finally {
			await app.end();
		}
	});

	it('should error if attempting to bind to invalid port', async function () {
		process.env.PORT = 1;
		const app = createServer();
		try {
			await app.setup();
			return expect(app.start()).to.be.rejectedWith('listen EACCES: permission denied 0.0.0.0:1');
		}
		finally {
			await app.end();
		}
	});

	it('should error if process.env.PORT is undefined', function () {
		process.env.PORT = undefined;
		expect(() => createServer()).to.throw(
			'The configuration path, PORT, is expected to be an integer but the value is undefined'
		);
	});

	it('should error if process.env.PORT is empty', function () {
		process.env.PORT = '';
		expect(() => createServer()).to.throw(
			'The configuration path, PORT, is expected to be required but the value is '
		);
	});

	it('should error if process.env.PORT is negative', function () {
		process.env.PORT = '-1';
		expect(() => createServer()).to.throw(
			'The configuration path, PORT, is expected to be > 0 but the value is -1'
		);
	});
});
