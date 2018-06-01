const graphql = require('graphql')
const graphqlType = require('./index')

module.exports = new graphql.GraphQLObjectType({
  name: 'book',
  description: 'Книги',
  fields: () => ({
    _id: {type: graphql.GraphQLString},
    title: {
      type: graphql.GraphQLString,
    },
    authors: {
      type: new graphql.GraphQLList(graphqlType.Authors),
      resolve: obj => obj.authors && obj.authors.map(author => author.author)
    }
  })
});
