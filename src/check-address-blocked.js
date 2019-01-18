'use strict';

module.exports = () => {
	return (address) => {
		if (address === '192.168.1.0') {
			return {
				status: true,
				source: 'null-list',
			};
		}
		return {
			status: false,
		};
	};
};
