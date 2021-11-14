const { nodesSchema } = require('../../../database/dbController');
const { stats } = require('./stats');

(async () => {
  // const nodes = await nodesSchema.find({ updated: true }).select('label account');
  // console.log('Nodes count:', nodes.length);
  // const all = [];
  // for (const i of nodes) {
  //   const node = await nodesSchema.findOne({ _id: i._id }).select('history');
  //   all.push({
  //     label: i.label,
  //     account: i.account,
  //     lastSubs: getLastSubs(node.history),
  //   });
  // }
  await stats();
})();
