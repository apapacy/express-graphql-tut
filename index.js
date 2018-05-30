const express = require('express');
const graphqlHTTP = require('express-graphql');
const scheme = require('./scheme');

const app = express();

app.use('/graphql', graphqlHTTP({
  schema: scheme,
  graphiql: true
}));

app.listen(4000);
