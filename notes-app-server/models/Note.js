const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  userId: String,
});

module.exports = mongoose.model('Note', noteSchema);