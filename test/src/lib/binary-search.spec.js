'use strict';

const binarySearch = require('../../../src/lib/binary-search');

describe('/src/lib/binary-search', function () {
	[
		{
			description: 'sort search for value to the most left start position',
			needle: 1,
			haystack: [
				{start: 1, end: 2},
				{start: 3, end: 4},
				{start: 5, end: 6},
				{start: 7, end: 8},
				{start: 9, end: 10},
			],
			result: {start: 1, end: 2},
		},
		{
			description: 'sort search for value to the most left end position',
			needle: 2,
			haystack: [
				{start: 1, end: 2},
				{start: 3, end: 4},
				{start: 5, end: 6},
				{start: 7, end: 8},
				{start: 9, end: 10},
			],
			result: {start: 1, end: 2},
		},
		{
			description: 'sort search for value to the most right end position',
			needle: 10,
			haystack: [
				{start: 1, end: 2},
				{start: 3, end: 4},
				{start: 5, end: 6},
				{start: 7, end: 8},
				{start: 9, end: 10},
			],
			result: {start: 9, end: 10},
		},
		{
			description: 'sort search for value to the most right start position',
			needle: 9,
			haystack: [
				{start: 1, end: 2},
				{start: 3, end: 4},
				{start: 5, end: 6},
				{start: 7, end: 8},
				{start: 9, end: 10},
			],
			result: {start: 9, end: 10},
		},
		{
			description: 'sort miss on value outside of lowest range',
			needle: 0,
			haystack: [
				{start: 1, end: 2},
				{start: 3, end: 4},
				{start: 5, end: 6},
				{start: 7, end: 8},
				{start: 9, end: 10},
			],
			result: undefined,
		},
		{
			description: 'sort miss on value outside of highest range',
			needle: 11,
			haystack: [
				{start: 1, end: 2},
				{start: 3, end: 4},
				{start: 5, end: 6},
				{start: 7, end: 8},
				{start: 9, end: 10},
			],
			result: undefined,
		},
		{
			description: 'sort miss on value just after a range',
			needle: 3,
			haystack: [
				{start: 1, end: 2},
				{start: 5, end: 6},
				{start: 7, end: 8},
				{start: 9, end: 10},
			],
			result: undefined,
		},
		{
			description: 'sort miss on value just before a range',
			needle: 4,
			haystack: [
				{start: 1, end: 2},
				{start: 5, end: 6},
				{start: 7, end: 8},
				{start: 9, end: 10},
			],
			result: undefined,
		},
	].forEach(({description, needle, haystack, result}) => {
		it(`should ${description}`, function () {
			expect(binarySearch(haystack, needle)).to.deep.equal(result);
		});
	});
});
