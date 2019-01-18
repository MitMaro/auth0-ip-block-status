'use strict';

const createCheckAddressIsBlocked = require('../../../src/lib/check-address-blocked');

const addresses = [
	{start: 0, end: 3232235875, blocked: false, meta: {}}, // 0.0.0.0 - 192.168.1.99
	{start: 3232235876, end: 3232236031, blocked: true, meta: {source: ['a']}}, // 192.168.1.100-255
	{start: 3232236032, end: 3232236543, blocked: false, meta: {}}, // 192.168.2.0 - 192.168.3.255
	{start: 3232236544, end: 3232236545, blocked: true, meta: {source: ['b']}}, // 192.168.4.0-1
	{start: 3232236546, end: 3232236927, blocked: false, meta: {}}, // 192.168.3.255 - 192.168.5.127
	{start: 3232236928, end: 3232236928, blocked: true, meta: {source: ['a', 'b']}}, // 192.168.5.128
	{start: 3232236929, end: 4294967295, blocked: false, meta: {}}, // 192.168.5.129 - 255.255.255.255
];

describe('/src/lib/checkAddressIsBlocked', function () {
	const checkAddressIsBlocked = createCheckAddressIsBlocked();
	checkAddressIsBlocked.updateAddresses(addresses);
	[
		{
			description: 'find allowed address from start of first range',
			ipAddress: '0.0.0.0',
			result: {blocked: false},
		},
		{
			description: 'find allowed address from end of first range',
			ipAddress: '192.168.1.99',
			result: {blocked: false},
		},
		{
			description: 'find allowed address from start of last range',
			ipAddress: '192.168.5.129',
			result: {blocked: false},
		},
		{
			description: 'find allowed address from end of last range',
			ipAddress: '255.255.255.255',
			result: {blocked: false},
		},
		{
			description: 'find blocked address from start of source list "a" range',
			ipAddress: '192.168.1.100',
			result: {blocked: true, source: ['a']},
		},
		{
			description: 'find blocked address from end of source list "a" range',
			ipAddress: '192.168.1.255',
			result: {blocked: true, source: ['a']},
		},
		{
			description: 'find blocked address from start of source list "b" range',
			ipAddress: '192.168.4.0',
			result: {blocked: true, source: ['b']},
		},
		{
			description: 'find blocked address from end of source list "b" range',
			ipAddress: '192.168.4.1',
			result: {blocked: true, source: ['b']},
		},
		{
			description: 'find blocked address from shared source list range',
			ipAddress: '192.168.5.128',
			result: {blocked: true, source: ['a', 'b']},
		},
	].forEach(({description, ipAddress, result}) => {
		it(`should ${description}`, function () {
			expect(checkAddressIsBlocked.match(ipAddress)).to.deep.equal(result);
		});
	});
});
