const graphql = require('graphql')
const graphqlType = require('./index')

module.exports = new graphql.GraphQLObjectType({
  name: 'books',
  description: 'Книги',
  fields: () => ({
    _id: {type: graphql.GraphQLString},
    title: {
      type: graphql.GraphQLString,
    },
    authors: {
      type: new graphql.GraphQLList(graphqlType.Authors),
      resolve: (obj, args, context) => obj.authors && obj.authors.map(author => context.dataLoader.authorLoader.load(author.author.toString()))
    }
  })
});
