const graphql = require('graphql')
const graphqlType = require('./index')

module.exports = new graphql.GraphQLObjectType({
  name: 'book',
  description: 'Книги',
  fields: () => ({
    _id: {type: graphql.GraphQLString},
    title: {
      type: graphql.GraphQLString,
      resolve: (obj) => {
        return obj.title;
      }
    },
    authors: {
      type: new graphql.GraphQLList(graphqlType.Author),
      resolve: (obj) => {
        return obj.authors && obj.authors.map(async (author) => {
          return author.author
        });
      }
    }
  })
});
