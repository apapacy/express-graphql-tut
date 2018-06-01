const graphql = require('graphql');
// const author = require('./author');
// const book = require('./book');
const authors = require('./authors');
const books = require('./books');


module.exports = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    // author,
    // book,
    authors,
    books,
  }
})
