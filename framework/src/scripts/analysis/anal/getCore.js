const { nodesSchema } = require('../../database/dbController');
const moment = require('moment');
const { getYesterdaySubs } = require('../../mining/helpers');
const fs = require('fs-extra');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

function getCore(all) {
  let arr = all[0].lastSubs;
  for (i in all) {
    if (i == 0) continue;
    arr = getCommon(all[i].lastSubs, arr);
  }
  console.log(arr);
}

module.exports = {
  getCore,
};
