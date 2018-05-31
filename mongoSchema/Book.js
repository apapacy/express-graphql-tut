const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  title: String
});

schema.virtual('authors', {
  ref: 'BookAuthor',
  localField: '_id',
  foreignField: 'book'
});

module.exports = schema;
