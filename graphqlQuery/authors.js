const graphql = require('graphql');
const getFieldNames = require('graphql-list-fields');
const graphqlType = require('../graphqlType');
const mongoSchema = require('../mongoSchema');

module.exports = {
  type: new graphql.GraphQLList(graphqlType.Authors),
  args: {
    _id: {
      type: graphql.GraphQLString
    }
  },
  resolve: (_, {_id}, context, info) => {
    const fields = getFieldNames(info);
    const where = _id ? {_id} : {};
    const authors = mongoSchema.Author.find(where).populate('books')
    return authors.exec();
  }
};
