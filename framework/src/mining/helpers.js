const moment = require('moment');
const config = require('../core/config');
const { TwitterApi } = require('twitter-api-v2');

function insureConnection(type = 0) {
  if (type == 0) {
    return new TwitterApi(config.BEAR);
  }
  if (type == 1) {
    return new TwitterApi(config.BEAR2);
  }
  // const {data} = await client.v2.userByUsername('plhery');
  // if(data.id != 290981389) throw new Error("Auth Error");
}

module.exports = {
  insureConnection,
  getYesterdaySubs,
};

function getYesterdaySubs(history) {
  const tmp_arr = history.sort((a, b) => moment(a.day).format('YYYYMMDD') - moment(b.day).format('YYYYMMDD'));
  return tmp_arr[0]?.subs.map((sub) => sub.id) || [];
}
