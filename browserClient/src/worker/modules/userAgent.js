const UserAgent = require('user-agents');

function generateAgent(deviceCategory = 'desktop') {
	const userAgent = new UserAgent({ deviceCategory });
	console.log(userAgent.toString());
	return userAgent.toString();
}

function generateViewport(deviceCategory = 'desktop') {
	const userAgent = new UserAgent({ deviceCategory });
	console.log({ width: userAgent.viewportWidth, height: userAgent.viewportHeight });
	return { width: userAgent.viewportWidth, height: userAgent.viewportHeight };
}

module.exports = {
	generateAgent,
	generateViewport,
};
