const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: String
});

schema.virtual('books', {
  ref: 'BookAuthor',
  localField: '_id',
  foreignField: 'author'
});

module.exports = schema;
