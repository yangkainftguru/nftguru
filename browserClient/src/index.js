'use strict';

const Parser = require('./worker/binarium');
const creds = require('./libs/config');

const parser = new Parser(creds.LOGIN, creds.PASSWORD);
module.exports = parser;
