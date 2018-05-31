const graphql = require('graphql')
const getFieldNames = require('graphql-list-fields');
const mongoSchema = require('./mongoSchema');
let BookType;
let AuthorType;

BookType = new graphql.GraphQLObjectType({
  name: 'book',
  description: 'Книги',
  fields: () => ({
    _id: {type: graphql.GraphQLString},
    title: {
      type: graphql.GraphQLString,
      resolve: (obj) => {
        return obj.title;
      }
    },
    authors: {
      type: new graphql.GraphQLList(AuthorType),
      resolve: (obj) => {
        return obj.authors && obj.authors.map(async (author) => {
          return author.author
        });
      }
    }
  })
});

AuthorType = new graphql.GraphQLObjectType({
  name: 'author',
  description: 'Авторы',
  fields: () => ({
    _id: {type: graphql.GraphQLString},
    name: {
      type: graphql.GraphQLString,
      resolve: (obj) => {
        return obj.name;
      }
    },
    books: {
      type: new graphql.GraphQLList(BookType),
      resolve: (obj) => {
        return obj.books && obj.books.map(async (book) => {
          return book.book
        });
      }
    }
  })
});

const query = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    author: {
      type: new graphql.GraphQLList(AuthorType),
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
      type: new graphql.GraphQLList(BookType),
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
      type: AuthorType,
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
      type: BookType,
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
