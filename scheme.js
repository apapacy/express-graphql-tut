const graphql = require('graphql')
const getFieldNames = require('graphql-list-fields');
const mongoSchema = require('./mongoSchema');
const graphqlType = require('./graphqlType');

const query = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    author: {
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
    },
    book: {
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
    },
  }
})

const mutation = new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createAuthor: {
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
    },
    createBook: {
      type: graphqlType.Book,
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
    },
  }
})

module.exports = new graphql.GraphQLSchema({
  query,
  mutation
})
