const graphql = require('graphql')
const DataLoader = require('dataloader')
const graphqlType = require('./index')
const mongoSchema = require('../mongoSchema');

const authorLoader = new DataLoader(ids => {
  console.log('++++++++++++++++++')

  return mongoSchema.Author.find({ _id: { $in: ids }});
});

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
      resolve: obj => obj.authors && obj.authors.map(author => authorLoader.load(author.author))
    }
  })
});
