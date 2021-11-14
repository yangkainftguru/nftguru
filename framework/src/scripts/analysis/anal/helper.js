function getLastSubs(history) {
  const tmp_arr = history.sort((a, b) => moment(a.day).format('YYYYMMDD') - moment(b.day).format('YYYYMMDD'));
  const subs = tmp_arr[0].subs;
  return subs;
}

function getCommon(arr1, arr2) {
  return arr1.filter((sub) => arr2.map((i) => i.id).includes(sub.id));
}

module.exports = {
  getCommon,
  getLastSubs,
};
