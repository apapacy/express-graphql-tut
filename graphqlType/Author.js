const graphql = require('graphql')
const graphqlType = require('./index')

module.exports = new graphql.GraphQLObjectType({
  name: 'author',
  description: 'Авторы',
  fields: () => ({
    _id: {type: graphql.GraphQLString},
    name: {
      type: graphql.GraphQLString,
    },
    books: {
      type: new graphql.GraphQLList(graphqlType.Book),
      resolve: obj => obj.books && obj.books.map(book => book.book)
    }
  })
});
