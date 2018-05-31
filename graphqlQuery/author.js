const graphql = require('graphql');
const getFieldNames = require('graphql-list-fields');
const graphqlType = require('../graphqlType');
const mongoSchema = require('../mongoSchema');

module.exports = {
  type: new graphql.GraphQLList(graphqlType.Author),
  args: {
    _id: {
      type: graphql.GraphQLString
    }
  },
  resolve: (_, {_id}, context, info) => {
    const fields = getFieldNames(info);
    const where = _id ? {_id} : {};
    const authors = mongoSchema.Author.find(where)
    if (fields.indexOf('books.authors.name') > -1 ) {
      authors.populate({
        path: 'books',
        populate: {
          path: 'book',
          populate: {path: 'authors', populate: {path: 'author'}}
        }
      })
    } else if (fields.indexOf('books.title') > -1 ) {
      authors.populate({path: 'books', populate: {path: 'book'}})
    }
    return authors.exec();
  }
};
