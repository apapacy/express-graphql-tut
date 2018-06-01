const graphql = require('graphql');
const graphqlType = require('../graphqlType');
const mongoSchema = require('../mongoSchema');
const dataLoader = require('./dataLoader');

module.exports = {
  type: new graphql.GraphQLList(graphqlType.Books),
  args: {
    _id: {
      type: graphql.GraphQLString
    }
  },
  resolve: (_, {_id}, context, info) => {
    context.dataLoader = dataLoader();
    const where = _id ? {_id} : {};
    return mongoSchema.Book.find(where).exec();
  }
};
