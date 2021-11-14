const puppeteer = require('puppeteer-extra');
const { generateAgent } = require('./userAgent');

const pluginStealth = require('puppeteer-extra-plugin-stealth');
puppeteer.use(pluginStealth());

function createStandartBrowser(headless) {
	const args = ['--no-sandbox', '--disable-setuid-sandbox'];

	const options = {
		headless,
		slowMo: 250,
		args,
	};

	return puppeteer.launch(options);
}

function createProductionBrowser(headless) {
	const args = [
		'--no-sandbox', 
		'--disable-setuid-sandbox',
		'--disable-dev-shm-usage',
		'--lang=ru-RU,ru',
	];

	const options = {
		headless,
		// slowMo: 1,
		args,
	};

	if (process.env.DOCKER === true) options.executablePath = '/usr/bin/chromium-browser';
	return puppeteer.launch(options);
}

function createBrowserWithAgent(headless) {
	const userAgent = generateAgent('desktop');
	const args = [
		'--no-sandbox',
		'--disable-setuid-sandbox',
		'--disable-infobars',
		'--window-position=0,0',
		'--ignore-certifcate-errors',
		'--ignore-certifcate-errors-spki-list',
		`--user-agent="${userAgent}"`,
	];

	const options = {
		args,
		headless,
		ignoreHTTPSErrors: true,
	};

	return puppeteer.launch(options);
}

module.exports = {
	createStandartBrowser,
	createBrowserWithAgent,
	createProductionBrowser,
};
