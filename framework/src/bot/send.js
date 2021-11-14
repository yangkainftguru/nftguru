const { nodesSchema } = require('../database/dbController');
const { signalSchema } = require('../database/dbController');
const { buildGraphV2 } = require('./graphBuilder');

const send10Signals = async () => {
  const signals = await signalSchema.find({ posted: false }).limit(10);

  console.log(constructMessage(signals));
  await constructGraph(signals);

  await updateSignals(signals);
};

const constructMessage = (signals) => {
  return signals.map((i) => `https://twitter.com/${i.name}`).join('\n');
};

const updateSignals = async (signals) => {
  for (const s of signals) {
    s.posted = true;
    await s.save();
  }
};

const constructGraph = async (signals) => {
  const edgeList = [];
  const nodeList = [];
  const addNodeIfUnique = (newNodeName, type) => !nodeList.find((node) => node.name === newNodeName) && nodeList.push({ name: newNodeName, type });
  for (const signal of signals) {
    signal.parents.forEach((parentName) => {
      addNodeIfUnique(parentName, 0);
      edgeList.push({ from: parentName, to: signal.name });
    });
    addNodeIfUnique(signal.name, 1);
  }

  await buildGraphV2(nodeList, edgeList);
};

function getNodeChildren(history, signals) {
  const signalren = [];
  for (const signal of signals) {
    for (const tsKey of Object.keys(history)) {
      const ts = history[tsKey].subs;
      const element = ts.find((i) => i.username === signal.username);
      if (element) {
        signalren.push(element);
        break;
      }
    }
  }
  return signalren;
}

(async () => {
  await send10Signals();
  process.exit();
})();
