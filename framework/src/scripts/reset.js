const { nodesSchema } = require('../database/dbController');

(async () => {
  await reset();
  process.exit();
})();

async function reset() {
  const all = await nodesSchema.find().select('updated reserved new_subs');
  for (const i of all) {
    i.updated = false;
    i.reserved = false;
    i.new_subs = [];
    await i.save();
  }
}

// ----------------------------------------------

// async function updateOne() {
//   const parser = new Parser(0);

//   const i = await nodesSchema.findOne({
//     updated: true,
//   });
//   await parser.updateHistory(i);
// }

// async function addList(arr) {
//   const client = insureConnection();
//   const { data } = await client.v2.users(arr);
//   for (const i of data) {
//     await delay(0.1);
//     await _addNewNode(i.id, i.username);
//   }
// }
