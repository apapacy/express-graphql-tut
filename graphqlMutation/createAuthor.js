const graphql = require('graphql');
const getFieldNames = require('graphql-list-fields');
const graphqlType = require('../graphqlType');
const mongoSchema = require('../mongoSchema');

module.exports = {
  type: graphqlType.Author,
  args: {
    name: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    }
  },
  resolve: (_, {name}) => {
    const newAuthor = new mongoSchema.Author({name});
    return newAuthor.save()
  }
};
