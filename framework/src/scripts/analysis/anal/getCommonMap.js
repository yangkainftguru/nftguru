const { nodesSchema } = require('../../database/dbController');
const moment = require('moment');
const { getYesterdaySubs } = require('../../mining/helpers');
const fs = require('fs-extra');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

function getCommonMap(all) {
  const dict = {};
  for (i of all) {
    for (j of all) {
      if (i.account == j.account) continue;
      const id = Math.max(i.account, j.account);
      const id_ = Math.min(i.account, j.account);
      const key = `${id}-${id_}`;
      if (!dict[key]) {
        const common = getCommon(i.lastSubs, j.lastSubs);
        dict[key] = common.length;
      }
    }
  }
  console.log(dict);
}

module.exports = {
  getCommonMap,
};
