const fs = require('fs');

async function preload(page) {
	const preloadFile = fs.readFileSync(`${__dirname}/preload.js`, 'utf8');
	await page.evaluateOnNewDocument(preloadFile);
}

module.exports = {
	preload,
};
