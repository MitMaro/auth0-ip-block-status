'use strict';

module.exports = (checkIpAddressBlocked) => {
	return (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		if (req.method !== 'GET') {
			res.statusCode = 405;
			res.end();
			return;
		}

		if (req.url === '/healthcheck') {
			res.statusCode = 200;
			res.write(JSON.stringify({
				time: Date.now(),
				filterListCount: checkIpAddressBlocked.numberOfRanges,
				lastUpdate: checkIpAddressBlocked.lastUpdatedTime,
			}));
			res.end();
			return;
		}

		const ipAddress = req.url.substr(1);

		let result;
		let statusCode;

		try {
			result = checkIpAddressBlocked.match(ipAddress);
			statusCode = 200;
		}
		catch (err) {
			// eslint-disable-next-line no-console
			console.error(err);
			result = {error: err.message};
			statusCode = err.type === 'InvalidAddress' ? 400 : 500;
		}

		res.statusCode = statusCode;
		res.write(JSON.stringify(result));
		res.end();
	};
};
