'use strict';

const mongoose = require('mongoose');

const JokeSchema = new mongoose.Schema({
  category: { type: String, default: 'general' },
  joke: String,
});

module.exports = mongoose.model('jokes', JokeSchema);
