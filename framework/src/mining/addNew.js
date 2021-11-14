const { nodesSchema } = require('../database/dbController');
const { insureConnection } = require('./helpers');

(async () => {
  // await addNewNode('username');
})();

async function _addNewNode(id, username) {
  const a = await nodesSchema.findOne({ account: id });
  if (a) return;
  console.log('valid Node');
  const newNode = new nodesSchema({
    account: id,
    label: username,
    history: [],
    updated: false,
    new_subs: [],
  });

  await newNode.save();
}

async function addNewNode(username) {
  const client = insureConnection();
  const { data } = await client.v2.userByUsername(username);
  const a = await nodesSchema.findOne({ account: data.id });
  if (a) return;

  const newNode = new nodesSchema({
    account: data.id,
    label: username,
    history: [],
    updated: false,
    new_subs: [],
  });

  await newNode.save();
}

module.exports = {
  addNewNode,
  _addNewNode,
};
