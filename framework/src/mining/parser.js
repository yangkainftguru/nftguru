// https://github.com/plhery/node-twitter-api-v2/blob/HEAD/doc/auth.md#basic-authentification-flow
// https://tweeterid.com/

const { nodesSchema } = require('../database/dbController');
const moment = require('moment');
const { insureConnection, getYesterdaySubs } = require('./helpers');
const { delay } = require('../core/helpers');

(async () => {
  //   const parser = new Parser(0);
  //   await parser.updateAllSubs();
})();

class Parser {
  constructor(type) {
    this.type = type;
    this.client = insureConnection(type);
  }
  async updateAllSubs() {
    let i;
    do {
      i = await nodesSchema.findOne({ updated: false, reserved: false });
      if (!i) return;
      i.reserved = true;
      await i.save();

      await this.updateHistory(i);
    } while (i);

    console.log('Done');
  }

  async updateHistory(i) {
    console.log(i);
    const subs = await this.getSubs(i.account);
    const yesterdaySubs = getYesterdaySubs(i.history);
    console.log("Old subs:", yesterdaySubs.length);

    let new_subs = subs.filter((sub) => !yesterdaySubs.includes(sub.id));
    console.log("New subs:", new_subs.length);

    i.new_subs = new_subs;
    i.history.push({
      subs,
      day: moment().format(),
    });
    i.updated = true;
    await i.save();
  }

  async getSubs(account) {
    let next_token, rate;
    const all = [];

    do {
      console.log('tick');

      if (rate && rate.remaining <= 0) {
        const pause = -moment().diff(moment(rate.reset * 1000), 's');
        if (pause > 0) {
          console.log('Delay is set: ', pause);
          await delay(pause);
        }
      }

      let followings;
      try {
        const settings = { asPaginator: true };
        if (next_token) settings.pagination_token = next_token;

        followings = await this.client.v2.following(account, settings);

        next_token = followings.meta.next_token;
        rate = followings._rateLimit;

        const arr = followings.data.data || [];
        all.push(...arr);

        console.log('Delay is set: 60');
        await delay(60);
      } catch (err) {
        if (err.rateLimit) {
          rate = err.rateLimit;
          console.log('Error rate limit: ', rate);
        } else {
          console.log(err);
          console.log(followings);
        }
      }
    } while (next_token || rate.remaining <= 0);

    return all;
  }
}

module.exports = {
  Parser,
};
