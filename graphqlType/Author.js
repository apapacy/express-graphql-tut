const graphql = require('graphql')
const graphqlType = require('./index')

module.exports = new graphql.GraphQLObjectType({
  name: 'author',
  description: 'Авторы',
  fields: () => ({
    _id: {type: graphql.GraphQLString},
    name: {
      type: graphql.GraphQLString,
      resolve: (obj) => {
        return obj.name;
      }
    },
    books: {
      type: new graphql.GraphQLList(graphqlType.Book),
      resolve: (obj) => {
        return obj.books && obj.books.map(async (book) => {
          return book.book
        });
      }
    }
  })
});
