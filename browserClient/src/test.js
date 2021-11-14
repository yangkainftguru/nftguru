'use strict';

const Parser = require('./worker/twitter');
const creds = require('./libs/config');

(async () => {
	const parser = new Parser(creds.LOGIN, creds.PASSWORD, creds.USERNAME);
	const TEST = true;

	await parser.createSession(TEST);

	// console.log(await parser.checkAlive());

	// await parser.logIn(TEST);

	// console.log(await parser.checkAlive());
	
	await parser.getFollowers("CozomoMedici", TEST);
	
	// console.log(await parser.checkAlive());

	// await parser.closeAll();
})();
