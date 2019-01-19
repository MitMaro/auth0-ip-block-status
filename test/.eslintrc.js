module.exports = {
	root: true,
	extends: [
		'mitmaro',
		'mitmaro/config/ecmascript-9',
		'mitmaro/config/node',
		'mitmaro/config/mocha',
		'mitmaro/config/chai',
	],
	globals: {
		chai: true,
	}
};
