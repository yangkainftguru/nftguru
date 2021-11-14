const { nodesSchema } = require('../../../database/dbController');

async function stats() {
  const reserved = await nodesSchema.count({ reserved: true });
  const notUpdated = await nodesSchema.count({ updated: false });
  const updatedWithZeroNewSubs = await nodesSchema.count({
    updated: true,
    'new_subs.0': { $exists: false },
  });
  console.log({
    reserved,
    notUpdated,
    updatedWithZeroNewSubs,
  });
}
module.exports = {
  stats,
};
