const { signalSchema } = require('../database/dbController');
const { nodesSchema } = require('../database/dbController');

(async () => {
  // await signalSchema.find({ posted: false }).remove().exec();
  // const signals = await signalSchema.find({ posted: false });
  // console.log(signals.length);

  const nodes = await nodesSchema.find({ updated: true }).select('label account new_subs');

  const tmpDict = {};
  for (const node of nodes) {
    node.new_subs.forEach((newSub) => {
      const key = newSub.username;
      if (!tmpDict[key]) tmpDict[key] = { name: key, count: 0, parents: [] };
      tmpDict[key].count++;
      tmpDict[key].parents.push(node.label);
    });
  }

  const newNodes = Object.values(tmpDict)
    .map((node) => ({
      ...node,
      parents: node.parents.filter((x, i) => i === node.parents.indexOf(x)),
    }))
    .filter((node) => node.count > 3);

  console.log(newNodes.length);
  let i = 0;
  for (const newNode of newNodes) {
    const exist = await signalSchema.findOne({ $or: [{ name: newNode.name }, { username: newNode.name }] }).select('label');
    if (exist) continue;
    i++;

    const signal = new signalSchema({ ...newNode, posted: false });
    await signal.save();
    console.log(signal);
  }
  console.log(i);
  process.exit();
})();
