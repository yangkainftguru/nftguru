Object.defineProperty(navigator, 'languages', {
	get: function() {
		return ['en-US', 'en'];
	},
});

Object.defineProperty(navigator, 'plugins', {
	get: function() {
		return [1, 2, 3, 4, 5];
	},
});

Object.defineProperty(navigator, 'webdriver', { get: () => false });
