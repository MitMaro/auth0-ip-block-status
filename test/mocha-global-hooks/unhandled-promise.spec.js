/* eslint-disable no-console,mocha/no-top-level-hooks,mocha/no-hooks-for-single-case */
'use strict';

let unhandledError = false;
process.on('unhandledRejection', (reason) => {
	console.error('Unhandled Rejection');
	console.error(reason);
	unhandledError = true;
});

after(function (done) {
	setImmediate(() => {
		if (unhandledError) {
			return done(new Error('Unhandled promise in tests'));
		}
		return done();
	});
});
