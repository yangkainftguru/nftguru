const { nodesSchema } = require('../../database/dbController');
const moment = require('moment');
const { getYesterdaySubs } = require('../../mining/helpers');
const fs = require('fs-extra');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function getNewTopCSV() {
  const nodes = await nodesSchema.find({ updated: true }).select('label account new_subs');

  const dict = {};
  let data = [];
  for (node of nodes) {
    node.new_subs.forEach((newSub) => {
      if (!dict[newSub.id]) dict[newSub.id] = 0;
      dict[newSub.id]++;
      data.push({ from: node.label, to: newSub.username });
    });
  }

  const csvWriter = createCsvWriter({
    path: 'out.csv',
    header: [
      { id: 'from', title: 'From' },
      { id: 'to', title: 'To' },
    ],
  });
  await csvWriter.writeRecords(data);
}
module.exports = {
  getNewTopCSV,
};
