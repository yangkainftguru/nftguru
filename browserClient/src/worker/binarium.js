const { preload } = require('./modules/preload');
const { createProductionBrowser } = require('./modules/browser');
// const { generateViewport } = require('./modules/userAgent');

const { loginPage, profilePage } = require('./selectors');

class Parser {
	constructor(username, password) {
		this.username = username;
		this.password = password;
		this.myCookies = null;
	}

	async login(test = false) {
		const browser = await createProductionBrowser(!test);

		const page = await browser.newPage();
		// await page.setViewport(generateViewport());
		const context = browser.defaultBrowserContext();
		await context.overridePermissions('https://binarium.com/terminal', []);
		await preload(page);

		console.log('// Go to url');
		await page.goto(loginPage.url);
		// await page.waitForNavigation();
		// -----
		await page.click(loginPage.enter);
		// await page.waitFor(1000);

		console.log('// Type username');
		await page.click(loginPage.username);
		await page.keyboard.type(this.username);

		console.log('// Type password');
		await page.click(loginPage.password);
		await page.keyboard.type(this.password);

		console.log('// Click login button');
		await page.click(loginPage.loginButton);
		try {
			await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 });
		} catch (err) { }

		console.log('// ClosePopup');
		await this.closePopup(page, profilePage.popup.closeButton);

		console.log('// ClosePopup');
		await this.closePopup(page, profilePage.cookiePopup.closeButton);

		const type = await this.getAccountType(page);
		if (type !== 'REAL' && type !== 'DEMO') {
			console.log('// Login is failed');
			return false;
		}

		this.myCookies = await page.cookies(profilePage.url);

		this.page = page;
		this.browser = browser;
		console.log('// Login is done');
		return true;
	}

	async makeBid({ coin, direction, dealTime, time, money }, test = false) {
		const page = this.page;
		console.log('// Close popup -----');
		await this.closePopup(page, profilePage.popup.closeButton);

		console.log('// Change account');
		if ((await this.getAccountType(page)) !== 'DEMO') {
			await page.click(profilePage.changeType.accountChangeButton);
			await page.waitForSelector(profilePage.changeType.demoButton, { visible: true });
			await page.click(profilePage.changeType.demoButton);
		}

		console.log('// Bid set');
		const coinName = await page.$eval(profilePage.changeBid.activeCoin, e => e.innerText);
		const coinType = await page.$eval(profilePage.changeBid.activeCoinType, e => e.innerText);
		if (coinName !== coin || coinType !== 'Binary') {
			await page.click(profilePage.changeBid.changeButton);

			await page.waitForSelector(profilePage.changeBid.binaryButton, { visible: true });

			await page.click(profilePage.changeBid.binaryButton);

			await page.waitForSelector(profilePage.changeBid.searchInput, { visible: true });

			await this.inputClearAndSet(page, profilePage.changeBid.searchInput, coin);

			await page.waitForSelector(profilePage.changeBid.firstFound, { visible: true });
			await page.waitForFunction(`document.querySelector("${profilePage.changeBid.firstFound}").value != "${coin}"`);

			await page.click(profilePage.changeBid.firstFound);
		}

		console.log('// Input set');
		await page.waitForSelector(profilePage.interface.price, { visible: true });
		await this.inputClearAndSet(page, profilePage.interface.price, money);
		await page.keyboard.press('Enter');

		console.log('// Time set');
		const currentTime = await page.$eval(profilePage.changeTime.timeLabel, e => e.innerText);
		if (currentTime !== dealTime) {
			await page.click(profilePage.changeTime.timeButton);
			await page.waitForSelector(profilePage.changeTime.dropdownMenuList, { visible: true });

			const timeList = await this.getAllTimeList(page);
			if (test) dealTime = timeList[0].time;
			const timeExist = timeList.find(e => e.time === dealTime);
			if (!timeExist) {
				console.log(timeList, dealTime);
				return { status: false, mes: 'time not exist' };
			}
			await page.click(profilePage.changeTime.dropdownMenuItem(timeExist.i));
		}

		console.log('// Security rule for end time');
		const result = {}
		if (!test) {
			const [h, m, s] = time.split(':');
			const endDate = new Date();
			endDate.setHours(h);
			endDate.setMinutes(m);
			endDate.setSeconds(s + 10);
			const now = new Date();

			const diff = endDate - now;
			// console.log(now.toUTCString(), endDate.toUTCString(), diff);
			if (diff < 0) return { status: false, mes: `time for bid is expired ${Math.round(diff / 1000)}`, endDate };
			result.diff = diff;
		}

		console.log('// Click');
		if (direction === 'вниз') await page.click(profilePage.interface.down);
		else await page.click(profilePage.interface.up);

		result.profitability = await page.$eval(profilePage.data.profitability, e => e.innerText);
		result.revenue = await page.$eval(profilePage.data.revenue, e => e.innerText);
		result.totalMoney = await page.$eval(profilePage.data.totalMoney, e => e.innerText);
		result.status = true;
		result.bidTime = new Date();
		await page.waitFor(1 * 1000);

		return result;
	}

	async checkAlive() {
		try {
			const page = await this.browser.newPage();
			// this.setCookies(page);
			await page.goto(profilePage.url);
			await page.waitForSelector(profilePage.billType, { visible: true });
			const type = await this.getAccountType(page);

			if (type !== 'REAL' && type !== 'DEMO') {
				console.log('// Browser is not alive');
				return false;
			}
			console.log('// Browser is alive');
			return true;
		} catch (err) {
			console.log(`// Browser is not alive with error: ${err}`);
			return false;
		}
	}

	async closeAll() {
		try {
			await this.browser.close();
			delete this.browser;
			delete this.page;
			delete this.cookie;
		} catch (err) {
			console.log('Error while closing browser');
		}
	}

	// ---------------------------------------------------------------------------------------------

	async getAccountType(page) {
		const text = await page.$eval(profilePage.billType, e => e.innerText);
		return text;
	}

	async closePopup(page, selector) {
		try {
			await page.waitForSelector(selector, { timeout: 1000 });
			await page.click(selector);
			await this.closePopup(page);
		} catch (e) { }
	}

	async getAllTimeList(page, i = 2, names = []) {
		const selector = profilePage.changeTime.dropdownMenuItem(i);
		const isExist = (await page.$(selector)) !== null;
		if (!isExist) return names;

		const time = await page.$eval(selector, e => e.innerText);
		names.push({ time, i });
		return await this.getAllTimeList(page, i + 1, names);
	}

	async inputClearAndSet(page, selector, value) {
		await page.click(selector);
		const inputValue = await page.$eval(selector, el => el.value);
		for (let i = 0; i < inputValue.length; i++) {
			await page.keyboard.press('Backspace');
		}
		// console.log(String(value))
		await page.keyboard.type(String(value));
	}

	setCookies(page) {
		for (let cookie of this.myCookies) {
			page.setCookie(cookie);
		}
	}
}

module.exports = Parser;
