const graphql = require('graphql')
const DataLoader = require('dataloader')
const graphqlType = require('./index')
const mongoSchema = require('../mongoSchema');

const authorLoader = new DataLoader(async ids => {
  const data = await mongoSchema.Author.find({ _id: { $in: ids }}).populate('books').exec();
  const authors = data.reduce((obj, item) => (obj[item._id] = item) && obj, {})
  const response = ids.map(id => authors[id]);
  return response;
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
