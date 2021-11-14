'use strict';

const Parser = require('./worker/twitter');
const creds = require('./libs/config');

const express = require('express');
const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let parser = undefined;
let connected = false;
let bidMutexOccupied = false;

app.post('/connect', async (req, res) => {
	console.log('===> connect');
	try {
		parser = new Parser(creds.LOGIN, creds.PASSWORD, creds.USERNAME);
		
		await parser.createSession(true);
		
		const result = await parser.logIn();
		connected = result;
		return res.json({ result });
	} catch (err) {
		console.log(err);
		return res.send(err);
	}
});

app.get('/status', async (req, res) => {
	console.log('===> status');
	try {
		return res.json({
			exist: parser ? true : false,
			wasConnected: connected,
		});
	} catch (err) {
		console.log(err);
		return res.send(err);
	}
});

app.post('/check', async (req, res) => {
	console.log('===> check');
	if (!parser) return res.json({ exist: false });
	try {
		const result = await parser.checkAlive();
		connected = result;
		return res.json({ connected });
	} catch (err) {
		console.log(err);
		return res.send(err);
	}
});

const memory = {};

app.post('/parseFollowers', async (req, res) => {
	console.log('===> parseFollowers');
	if (!parser) return res.json({ exist: false });
	if (!connected) return res.json({ connected: false });
	if (bidMutexOccupied) return res.json({ mes: "can't getFollowers in paralel mode" });
	bidMutexOccupied = true;
	memory.result = [];
	res.json({ status: 'in progress' });
	try {
		const result = await parser.getFollowers(req.body.account);
		bidMutexOccupied = false;
		memory.result = result;
	} catch (err) {
		console.log(err);
		bidMutexOccupied = false;
		return res.send(err);
	}
});

app.post('/getFollowers', async (req, res) => {
	return res.json(memory);
});

app.listen(process.env.PORT || 9001, () => {
	console.log(`Example app listening on port ${process.env.PORT || 9001}!`);
});
