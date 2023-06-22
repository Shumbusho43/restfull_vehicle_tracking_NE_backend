const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  method: String,
  path: String,
  statusCode: Number,
  responseTime: Number,
});

module.exports.Log= mongoose.model('Log', logSchema);
