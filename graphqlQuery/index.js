const graphql = require('graphql');
const author = require('./author');
const book = require('./book');

module.exports = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    author,
    book
  }
})
