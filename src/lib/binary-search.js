'use strict';

module.exports = (haystack, needle) => {
	let left = 0;
	let right = haystack.length - 1;
	while (left <= right) {
		const mid = left + Math.floor((right - left) / 2);
		const range = haystack[mid];
		if (needle >= range.start) {
			if (needle <= range.end) {
				return range;
			}
			left = mid + 1;
		}
		else {
			right = mid - 1;
		}
	}
	// since the haystack should always contain the needle, this should never be reached
	return undefined;
};
