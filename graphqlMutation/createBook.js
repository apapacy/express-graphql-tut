const graphql = require('graphql');
const getFieldNames = require('graphql-list-fields');
const graphqlType = require('../graphqlType');
const mongoSchema = require('../mongoSchema');

module.exports = {
  type: graphqlType.Books,
  args: {
    title: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    authors: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLList(graphql.GraphQLString))
    }
  },
  resolve: async(_, {title, authors}) => {
    const book = new mongoSchema.Book({title});
    await book.save()
    for (let i = 0; i < authors.length; i++) {
      const author = await Author.findOne({name: authors[i]});
      const bookAuthor = new mongoSchema.BookAuthor({author, book})
      await bookAuthor.save();
    }
    return book;
  }
};
