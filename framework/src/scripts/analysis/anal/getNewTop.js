const { nodesSchema } = require('../../database/dbController');
const moment = require('moment');
const { getYesterdaySubs } = require('../../mining/helpers');
const fs = require('fs-extra');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function getNewTop() {
  const nodes = await nodesSchema.find({ updated: true }).select('label account new_subs');
  const dict = {};
  for (node of nodes) {
    node.new_subs.forEach((newSub) => {
      if (!dict[newSub.id])
        dict[newSub.id] = {
          count: 0,
          nodesSubscribed: [],
          username: newSub.username,
        };
      dict[newSub.id].count++;
      dict[newSub.id].nodesSubscribed.push({
        id: node.account,
        username: node.label,
      });
    });
  }
  const top = Object.keys(dict)
    .map((k) => ({ count: dict[k].count, username: dict[k].username }))
    .filter((i) => i.count >= 2)
    .sort((a, b) => b.count - a.count);
  fs.writeJsonSync('newTop.json', top);
}

module.exports = {
  getNewTop,
};
