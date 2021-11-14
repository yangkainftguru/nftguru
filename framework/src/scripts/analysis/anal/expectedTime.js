const { nodesSchema } = require('../../database/dbController');
const moment = require('moment');
const { getYesterdaySubs } = require('../../mining/helpers');
const fs = require('fs-extra');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function expectedTime(all) {
  let count = 0;
  for (i of all) {
    count += i.lastSubs.length;
  }
  console.log('Hours: ', count / 100 / 60);
}

module.exports = {
  expectedTime,
};
