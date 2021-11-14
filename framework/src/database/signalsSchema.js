const mongoose = require('mongoose');

const dataSchema = mongoose.Schema(
  {
    username: String, //depricated
    posted: { default: false, type: Boolean },
    parents: [{ type: String }],
    count: Number,
    name: String,
  },
  { collection: 'signals' },
);

const Signals = mongoose.model('signals', dataSchema);

module.exports = Signals;
