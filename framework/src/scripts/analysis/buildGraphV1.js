const moment = require('moment');
const { nodesSchema } = require('../database/dbController');
const fs = require('fs-extra');

(async () => {
  const nodes = await nodesSchema.find({ updated: true }).select('label account');
  console.log('Nodes count:', nodes.length);
  const all = [];
  for (const i of nodes) {
    const node = await nodesSchema.findOne({ _id: i._id }).select('history');
    all.push({
      label: i.label,
      account: i.account,
      lastSubs: getLastSubs(node.history),
    });
  }

  getTop(all);
  console.log('Done');
})();

function getTop(all) {
  const dict = {};
  for (nodeId in all) {
    const node = all[nodeId];
    node.lastSubs.forEach((j) => {
      if (!dict[j.id]) dict[j.id] = { count: 0, nodesSubscribed: [] };
      dict[j.id].count++;
      dict[j.id].nodesSubscribed.push({
        id: node.account,
        username: node.label,
      });
    });
  }
  const list = Object.keys(dict)
    .filter((key) => dict[key].count > 0)
    .map((key) => ({
      nodeId: key,
      ...dict[key],
    }));

  fs.writeJsonSync('report.json', { list });
}

function getLastSubs(history) {
  const tmp_arr = history.sort((a, b) => moment(a.day).format('YYYYMMDD') - moment(b.day).format('YYYYMMDD'));
  const subs = tmp_arr[0].subs;
  return subs;
}
