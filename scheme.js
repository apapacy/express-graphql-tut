const graphql = require('graphql')
require('dotenv').config()
const mongoose = require('mongoose')
const getFieldNames = require('graphql-list-fields');
mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`)

const Schema = mongoose.Schema

const authorSchema = new Schema({
  name: String
}, {
  toJSON: {
    virtuals: true
  }
});

authorSchema.virtual('books', {
  ref: 'BookAuthor',
  localField: '_id',
  foreignField: 'author'
});

const bookSchema = new Schema({
  title: String
}, {
  toJSON: {
    virtuals: true
  }
});

bookSchema.virtual('authors', {
  ref: 'BookAuthor',
  localField: '_id',
  foreignField: 'book'
});

const bookAuthorSchema = new Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }
}, {
  toJSON: {
    virtuals: true
  }
})

const Author =  mongoose.model('Author', authorSchema)
const Book =  mongoose.model('Book', bookSchema)
const BookAuthor =  mongoose.model('BookAuthor', bookAuthorSchema)


let BookType, AuthorType
BookType = new graphql.GraphQLObjectType({
  name: 'book',
  description: 'a book',
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
})

AuthorType = new graphql.GraphQLObjectType({
  name: 'author',
  description: 'the author',
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
})



// define the queries of the graphql Schema
const query = new graphql.GraphQLObjectType({
  name: 'TodoQuery',
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
        const authors = Author.find(where)
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
        const books = Book.find(where)
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



// define the mutations of the graphql Schema
const mutation = new graphql.GraphQLObjectType({
  name: 'TodoMutation',
  fields: {
    createAuthor: {
      type: AuthorType,
      args: {
        name: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
      },
      resolve: (_, {name}) => {
        const newAuthor = new Author({name});
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
        const book = new Book({title});
        await book.save()
        for (let i = 0; i < authors.length; i++) {
          const author = await Author.findOne({name: authors[i]});
          const bookAuthor = new BookAuthor({author, book})
          await bookAuthor.save();
        }
        return book;
      }
    },
  }
})
// creates and exports the GraphQL Schema
module.exports = new graphql.GraphQLSchema({
  query,
  mutation
})
