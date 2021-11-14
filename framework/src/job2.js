const { Parser } = require('./mining/parser');

(async () => {
  const parser = new Parser(1);
  await parser.updateAllSubs();
  console.log('Done');
})();
