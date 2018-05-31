const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }
});

module.exports = schema;
