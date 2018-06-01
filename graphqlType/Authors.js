const graphql = require('graphql')
const DataLoader = require('dataloader')
const graphqlType = require('./index')
const mongoSchema = require('../mongoSchema');

const bookLoader = new DataLoader(async ids => {
  const data = await mongoSchema.Book.find({ _id: { $in: ids }}).populate('authors').exec();
  const books = data.reduce((obj, item) => (obj[item._id] = item) && obj, {})
  const response = ids.map(id => books[id]);
  return response;
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
