const mongoose = require('mongoose');

const config = require('../core/config');
const nodesSchema = require('./nodesSchema');
const signalSchema = require('./signalsSchema');

mongoose.Promise = global.Promise;
mongoose
  .connect(config.DB_HOST, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .catch((e) => {
    console.error('Mongo Error->' + e);
  });

const db = mongoose.connection;

module.exports = { nodesSchema, db, signalSchema };
