const pages = {};

pages.loginPage = {
	url: 'https://twitter.com/i/flow/login',
	next: '.css-1dbjc4n:nth-child(2) > .css-1dbjc4n > .css-1dbjc4n > .css-18t94o4 > .css-901oao',
	next3: '.css-1dbjc4n:nth-child(2) > .css-1dbjc4n > .css-1dbjc4n > .css-18t94o4 > .css-901oao',
	loginButton: '.css-1dbjc4n:nth-child(2) > .css-18t94o4 > .css-901oao > .css-901oao > .css-901oao',
	warning: '.css-1dbjc4n:nth-child(1) > .css-1dbjc4n:nth-child(2) > .css-1dbjc4n > .css-901oao > .css-901oao',
	warningMessage: 'There was unusual login activity on your account. To help keep your account safe, please enter your phone number or username to verify it’s you.',
};

pages.profilePage = {
	url: 'https://twitter.com/home',
	home: 'header > div > div > div > div:nth-child(1) > div.css-1dbjc4n.r-dnmrzs.r-1vvnge1 > h1 > a',
	fButton: 'div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div.css-1dbjc4n.r-13awgt0.r-18u37iz.r-1w6e6rj > div.css-1dbjc4n.r-1mf7evn > a',
	linkSelector: '',

};

module.exports = pages;
