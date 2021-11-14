const { Parser } = require('./mining/parser');

(async () => {
  const parser = new Parser(0);
  await parser.updateAllSubs();
  console.log('Done');
})();
