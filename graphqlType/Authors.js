const graphql = require('graphql')
const graphqlType = require('./index')

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
      resolve: (obj, args, context) =>  obj.books && obj.books.map(book => context.dataLoader.bookLoader.load(book.book.toString()))
    }
  })
});
