'use strict';

function insertRange(ranges, newRange, start) {
	for (let i = start; i < ranges.length; i++) {
		const range = ranges[i];
		if (
			range.start > newRange.start
			|| (range.start === newRange.start && range.end > newRange.end)
		) {
			ranges.splice(i, 0, newRange);
			return;
		}
	}

	// if we get here then the range was not inserted and belongs at the end
	ranges.push(newRange);
}

module.exports = (ranges) => {
	// sort by start range followed by end range
	ranges.sort((a, b) => {
		if (a.start === b.start) {
			return a.end - b.end;
		}
		return a.start - b.start;
	});

	let current = ranges[0];
	let next = ranges[1];
	let i = 1;
	while (next !== undefined) {
		// cases:
		//   same start, same end
		//   same start, different end
		//   different start, same end
		//   different start, different end
		if (current.start === next.start) {
			current.meta.source = current.meta.source.concat(next.meta.source);
			ranges.splice(i, 1);
			if (current.end !== next.end) { // add a new range
				next.start = current.end + 1;
				insertRange(ranges, next, i);
			}
			next = ranges[i];
		}
		else if (current.end >= next.start) { // also current.start < next.start
			if (current.end !== next.end) {
				insertRange(ranges, {
					start: next.end + 1,
					end: current.end,
					blocked: true,
					meta: {source: [...current.meta.source]},
				}, i - 1);
			}
			next.meta.source = next.meta.source.concat(current.meta.source);
			current.end = next.start - 1;
			i++;
			current = next;
			next = ranges[i];
		}
		else {
			current = next;
			i++;
			next = ranges[i];
		}
	}

	return ranges;
};
