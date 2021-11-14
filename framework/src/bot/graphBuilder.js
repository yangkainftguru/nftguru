const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function buildGraphV2(u_nodes, u_edges) {
  let csvWriter = createCsvWriter({
    path: 'meta/nodes.csv',
    header: [
      { id: 'name', title: 'Id' },
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
    u_edges.map((edge) => ({
      from: u_nodes.findIndex((node) => node.name == edge.from),
      to: u_nodes.findIndex((node) => node.name == edge.to),
    })),
  );
}

module.exports = { buildGraphV2 };
