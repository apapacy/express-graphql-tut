const graphql = require('graphql');
const getFieldNames = require('graphql-list-fields');
const graphqlType = require('../graphqlType');
const mongoSchema = require('../mongoSchema');

module.exports = {
  type: new graphql.GraphQLList(graphqlType.Book),
  args: {
    _id: {
      type: graphql.GraphQLString
    }
  },
  resolve: (_, {_id}, context, info) => {
    const fields = getFieldNames(info);
    const where = _id ? {_id} : {};
    const books = mongoSchema.Book.find(where)
    if (fields.indexOf('authors.books.title') > -1 ) {
      books.populate({
        path: 'authors',
        populate: {
          path: 'author',
          populate: {path: 'books', populate: {path: 'book'}}
        }
      })
    } else if (fields.indexOf('authors.name') > -1 ) {
      books.populate({path: 'authors', populate: {path: 'author'}})
    }
    return books.exec();
  }
};
