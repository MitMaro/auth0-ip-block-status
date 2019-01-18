'use strict';

const mergeRanges = require('../../../src/lib/merge-ranges');

describe('/src/lib/merge-ranges', function () {
	[
		{
			description: 'handle non-overlapping ranges',
			input: [
				{start: 1, end: 5, blocked: true, meta: {source: ['a']}},
				{start: 6, end: 10, blocked: true, meta: {source: ['a']}},
				{start: 11, end: 20, blocked: true, meta: {source: ['a']}},
			],
			expected: [
				{start: 1, end: 5, blocked: true, meta: {source: ['a']}},
				{start: 6, end: 10, blocked: true, meta: {source: ['a']}},
				{start: 11, end: 20, blocked: true, meta: {source: ['a']}},
			],
		},
		{
			description: 'handle overlap with same start and end from different list',
			input: [
				{start: 1, end: 5, blocked: true, meta: {source: ['a']}},
				{start: 1, end: 5, blocked: true, meta: {source: ['b']}},
				{start: 1, end: 5, blocked: true, meta: {source: ['c']}},
			],
			expected: [
				{start: 1, end: 5, blocked: true, meta: {source: ['a', 'b', 'c']}},
			],
		},
		{
			description: 'handle overlap with same start but different end ',
			input: [
				{start: 1, end: 5, blocked: true, meta: {source: ['a']}},
				{start: 1, end: 10, blocked: true, meta: {source: ['b']}},
				{start: 1, end: 15, blocked: true, meta: {source: ['c']}},
			],
			expected: [
				{start: 1, end: 5, blocked: true, meta: {source: ['a', 'b', 'c']}},
				{start: 6, end: 10, blocked: true, meta: {source: ['b', 'c']}},
				{start: 11, end: 15, blocked: true, meta: {source: ['c']}},
			],
		},
		{
			description: 'handle overlap with different start but same end ',
			input: [
				{start: 1, end: 15, blocked: true, meta: {source: ['a']}},
				{start: 5, end: 15, blocked: true, meta: {source: ['b']}},
				{start: 10, end: 15, blocked: true, meta: {source: ['c']}},
			],
			expected: [
				{start: 1, end: 4, blocked: true, meta: {source: ['a']}},
				{start: 5, end: 9, blocked: true, meta: {source: ['b', 'a']}},
				{start: 10, end: 15, blocked: true, meta: {source: ['c', 'b', 'a']}},
			],
		},
		{
			description: 'handle overlap with different start and different end ',
			input: [
				{start: 1, end: 25, blocked: true, meta: {source: ['a']}},
				{start: 5, end: 20, blocked: true, meta: {source: ['b']}},
				{start: 10, end: 15, blocked: true, meta: {source: ['c']}},
			],
			expected: [
				{start: 1, end: 4, blocked: true, meta: {source: ['a']}},
				{start: 5, end: 9, blocked: true, meta: {source: ['b', 'a']}},
				{start: 10, end: 15, blocked: true, meta: {source: ['c', 'b', 'a']}},
				{start: 16, end: 20, blocked: true, meta: {source: ['b', 'a']}},
				{start: 21, end: 25, blocked: true, meta: {source: ['a']}},
			],
		},
	].forEach(({description, input, expected}) => {
		it(`should ${description}`, function () {
			expect(mergeRanges(input)).to.deep.equal(expected);
		});
	});
});
