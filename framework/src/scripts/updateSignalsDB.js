const { signalSchema } = require('../database/dbController');

const top1 = require('./meta/newTop-1-Nov');
const top3 = require('./meta/newTop-3-Nov');
const story = require('./meta/story.js');

(async () => {
  const myArray = [...top1, ...top3];
  const uniqueArray = myArray.filter((v, i, a) => a.findIndex((t) => t.username === v.username) === i).filter(({ count }) => count >= 3);
  // console.log(uniqueArray.length);

  const uniqueArrayF = uniqueArray.filter((i) => !story.includes(i.username));
  // console.log(uniqueArrayF.length);
  for (const i of uniqueArrayF) {
    const s = new signalSchema({ username: i.username, posted: false });
    await s.save();
  }
  const l = await signalSchema.count();
  console.log(l);
  process.exit();
})();
// const array = a.filter(({ count }) => count >= 3).map((i) => `https://twitter.com/${i.username}`);

// let i,
//   j,
//   temporary,
//   chunk = 10;
// for (i = 0, j = array.length; i < j; i += chunk) {
//   temporary = array.slice(i, i + chunk);
//   console.log(temporary.join(' \n'), '\n');
// }
