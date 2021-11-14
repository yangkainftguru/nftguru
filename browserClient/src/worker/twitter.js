const { preload } = require('./modules/preload');
const { createProductionBrowser } = require('./modules/browser');

const { loginPage, profilePage } = require('./selectors');

class Parser {
	constructor(login, password, username) {
		this.login = login;
		this.password = password;
		this.username = username;
		this.myCookies = null;
	}

	async createSession(test = false){
		const browser = await createProductionBrowser(!test);
		
		const page = await browser.newPage();
		const context = browser.defaultBrowserContext();
		await context.overridePermissions('https://twitter.com/', []);
		await preload(page);
		await page.setExtraHTTPHeaders({
			'Accept-Language': 'ru'
		});
		await page.evaluateOnNewDocument(() => {
			Object.defineProperty(navigator, "language", {
				get: function() {
					return "ru-RU";
				}
			});
			Object.defineProperty(navigator, "languages", {
				get: function() {
					return ["ru-RU", "ru"];
				}
			});
		});

		this.page = page;
		this.browser = browser;
		return true;
	}

	async logIn() {
		const page = this.page;

		console.log('// Go to url');
		await page.goto(loginPage.url);
		await page.waitFor(5000);

		console.log('// Type Login');
		await page.keyboard.type(this.login);
		await page.waitFor(2000);

		console.log('// Click next');
		await page.waitForSelector(loginPage.next);
		await page.click(loginPage.next);
		await page.waitFor(1000);
		
		console.log('// Check for errors');
		await page.waitForSelector(loginPage.warning)
		const inputValue = await page.$eval(loginPage.warning , el => el.textContent);
		console.log(inputValue);
		if (inputValue == loginPage.warningMessage) {
			console.log('// Type username');
			await page.keyboard.type(this.username);
			await page.waitFor(2000);
		
			console.log('// Click next');
			await page.waitForSelector(loginPage.next3)
			await page.click(loginPage.next3)
			await page.waitFor(2000);
		}
		
		console.log('// Type password');
		await page.keyboard.type(this.password);
		await page.waitFor(2000);

		console.log('// Click login');
		await page.waitForSelector(loginPage.loginButton)
		await page.click(loginPage.loginButton)

		await page.waitFor(10000);
		console.log('// Login is done');

		return true;
	}

	async getFollowers(account) {
		const page = this.page;

		console.log('// Go to url');
		const url = "https://twitter.com/"+account+'/following';
		console.log(url);
		await page.goto(url);
		await page.waitFor(8000);

		
		let totalSpans = await this.scrollToBottom(page);
		totalSpans = totalSpans.filter((c, index) => totalSpans.indexOf(c) === index);
		console.log(totalSpans);

		return totalSpans;
	}

	async scrollToBottom(page) {
		const distance = 100; // should be less than or equal to window.innerHeight
		const delay = 300;
		const totalSpans = [];
		while (await page.evaluate(() => document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight)) {
			await page.evaluate((y) => { document.scrollingElement.scrollBy(0, y); }, distance);
			await page.waitFor(delay);

			const spans = await page.evaluate(() => Array.from(document.querySelectorAll('div.css-1dbjc4n.r-18u37iz.r-1wbh5a2 > div > span'), el => el.textContent));
			console.log(spans.length);
			totalSpans.push(...spans);
		}
		return totalSpans;
	}

	async checkAlive() {
		try {
			const page = this.page;
			// const page = await this.browser.newPage();
			// this.setCookies(page);
			await page.goto(profilePage.url);
			await page.waitFor(2000);
			await page.waitForSelector(profilePage.home, { visible: true, timeout: 2000 });
			const inputValue = await page.$eval(profilePage.home , el => el.textContent);
			console.log(inputValue);
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

	delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}
	  

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
