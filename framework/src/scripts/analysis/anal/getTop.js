const { nodesSchema } = require('../../database/dbController');
const moment = require('moment');
const { getYesterdaySubs } = require('../../mining/helpers');
const fs = require('fs-extra');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

function getTop(all) {
  const dict = {};
  for (i in all) {
    all[i].lastSubs.forEach((j) => {
      if (!dict[j.id]) dict[j.id] = 0;
      dict[j.id]++;
    });
  }
  const top = Object.keys(dict)
    .map((k) => ({ id: k, count: dict[k] }))
    .filter((i) => i.count > 4)
    .sort((a, b) => b.count - a.count);
  fs.writeJsonSync('top.json', top);
  console.log(top.slice(10));
  console.log(top.length);
}

module.exports = {
  getTop,
};
