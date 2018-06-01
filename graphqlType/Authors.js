const graphql = require('graphql')
const DataLoader = require('dataloader')
const graphqlType = require('./index')
const mongoSchema = require('../mongoSchema');

const bookLoader = new DataLoader(async ids => {
  console.log('***************', ids)
  const promise = [];
  ids.map(id => promise.push(mongoSchema.Book.findOne({ _id: id })))
  return promise
});

module.exports = new graphql.GraphQLObjectType({
  name: 'authors',
  description: 'Авторы',
  fields: () => ({
    _id: {type: graphql.GraphQLString},
    name: {
      type: graphql.GraphQLString,
    },
    books: {
      type: new graphql.GraphQLList(graphqlType.Books),
      resolve: obj => obj.books && obj.books.map(book => bookLoader.load(book.book))
    }
  })
});
