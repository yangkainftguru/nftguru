const { nodesSchema } = require('../../database/dbController');
const moment = require('moment');
const { getYesterdaySubs } = require('../../mining/helpers');
const fs = require('fs-extra');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

function hC(all) {
  const dict = {};
  for (i of all) {
    if (!dict[i.account]) dict[i.account] = 0;
    dict[i.account]++;
  }
  console.log(dict);
}

module.exports = {
  hC,
};
