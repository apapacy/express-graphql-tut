const mongoose = require('mongoose');
const Author = require('./Author');
const Book = require('./Book');
const BookAuthor = require('./BookAuthor');

mongoose.connect('mongodb://localhost:27017/todolist')
mongoose.set('debug', true);

exports.Author =  mongoose.model('Author', Author);
exports.Book =  mongoose.model('Book', Book);
exports.BookAuthor =  mongoose.model('BookAuthor', BookAuthor);
