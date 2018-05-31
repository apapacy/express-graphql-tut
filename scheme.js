const graphql = require('graphql')
const query = require('./graphqlQuery');
const mutation = require('./graphqlMutation');

module.exports = new graphql.GraphQLSchema({
  query,
  mutation
})
