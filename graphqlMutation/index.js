const graphql = require('graphql');
const createAuthor = require('./createAuthor');
const createBook = require('./createBook');

module.exports =  new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createAuthor,
    createBook
  }
});
