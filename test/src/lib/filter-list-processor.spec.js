'use strict';

const filterListProcessor = require('../../../src/lib/filter-list-processor');

describe('/src/lib/filter-list-processor', function () {
	[
		{
			description: 'ignore lines with comments',
			input: {
				a: [
					'# this is a comment',
					' # this is a comment with leading whitespace',
					'0.0.0.0',
				].join('\n'),
			},
			expected: [
				{start: 0, end: 0, blocked: true, meta: {source: ['a']}},
			],
		},
		{
			description: 'ignore empty line',
			input: {
				a: [
					'   ',
					'\t',
					'0.0.0.0',
					'   ',
					'\t',
				].join('\n'),
			},
			expected: [
				{start: 0, end: 0, blocked: true, meta: {source: ['a']}},
			],
		},
		{
			description: 'read CIDR entries',
			input: {
				a: [
					'0.0.0.0/8',
				].join('\n'),
			},
			expected: [
				{start: 0, end: 16777215, blocked: true, meta: {source: ['a']}},
			],
		},
		{
			description: 'read IP address entries',
			input: {
				a: [
					'0.0.0.0',
				].join('\n'),
			},
			expected: [
				{start: 0, end: 0, blocked: true, meta: {source: ['a']}},
			],
		},
		{
			description: 'should merge entries from multiple lists',
			input: {
				a: [
					'0.0.0.0',
					'0.0.0.1',
				].join('\n'),
				b: [
					'0.0.0.2',
					'0.0.0.1',
				].join('\n'),
			},
			expected: [
				{start: 0, end: 0, blocked: true, meta: {source: ['a']}},
				{start: 1, end: 1, blocked: true, meta: {source: ['a', 'b']}},
				{start: 2, end: 2, blocked: true, meta: {source: ['b']}},
			],
		},
	].forEach(({description, input, expected}) => {
		it(`should ${description}`, function () {
			expect(filterListProcessor(input)).to.deep.equal(expected);
		});
	});

	it('should error if filter lists contain no entries', function () {
		expect(() => filterListProcessor({a: ''})).to.throw('Filter lists contain no entries');
	});

	it('should error if filter lists contain an invalid entry', function () {
		expect(() => filterListProcessor({a: '999.999.999.999'})).to.throw(
			'Error while process filter list \'a\': Invalid IPv4 Address: 999.999.999.999'
		);
	});
});
