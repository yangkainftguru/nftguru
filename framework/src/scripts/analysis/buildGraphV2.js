const { nodesSchema } = require('../../database/dbController');
const moment = require('moment');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

(async () => {
  await buildGraphV2();
  process.exit();
})();

async function buildGraphV2() {
  const nodes = await nodesSchema.find({ updated: true }).select('label account new_subs');

  let finalNodes = {};

  let u_nodes = [];
  let u_edges = [];

  for (const node of nodes) {
    u_nodes.push({ id: node.label, type: 0 });
    finalNodes[node.label] = node.new_subs.length;
    node.new_subs.forEach((newSub) => {
      if (!finalNodes[newSub.username]) finalNodes[newSub.username] = 0;
      finalNodes[newSub.username]++;
      u_edges.push({ from: node.label, to: newSub.username });
    });
  }

  const new_finalNodes = Object.keys(finalNodes)
    .map((key) => ({ id: key, type: 1 }))
    .filter((node) => !u_nodes.map((i) => i.id).includes(node.id));

  u_nodes.push(...new_finalNodes);

  // Remove nodes
  const nodes_to_remove = Object.keys(finalNodes).filter((i) => finalNodes[i] <= 6);
  for (const nodeId of nodes_to_remove) {
    u_nodes = u_nodes.filter(({ id }) => id != nodeId);
    u_edges = u_edges.filter((obj) => obj.to != nodeId && obj.from != nodeId);
  }

  let csvWriter = createCsvWriter({
    path: 'meta/nodes.csv',
    header: [
      { id: 'id', title: 'Id' },
      { id: 'type', title: 'Type' },
    ],
  });
  await csvWriter.writeRecords(u_nodes);

  csvWriter = createCsvWriter({
    path: 'meta/edges.csv',
    header: [
      { id: 'from', title: 'From' },
      { id: 'to', title: 'To' },
    ],
  });
  await csvWriter.writeRecords(
    u_edges.map((i) => {
      if (finalNodes[i.from].type == 0 && finalNodes[i.to].type == 0) return;
      const res = {
        from: u_nodes.findIndex((j) => j.id == i.from),
        to: u_nodes.findIndex((j) => j.id == i.to),
      };
      return res;
    }),
  );
}

function getLastSubs(history) {
  const tmp_arr = history.sort((a, b) => moment(a.day).format('YYYYMMDD') - moment(b.day).format('YYYYMMDD'));
  const subs = tmp_arr[0].subs;
  return subs;
}
