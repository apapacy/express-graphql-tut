const graphql = require('graphql')
require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`)

const Schema = mongoose.Schema

const todoSchema = new Schema({
  content: String,
  done: Boolean
})

const Todo =  mongoose.model('Todo', todoSchema)


// define the Todo type for graphql
const TodoType = new graphql.GraphQLObjectType({
  name: 'todo',
  description: 'a todo item',
  fields: {
    _id: {type: graphql.GraphQLString},
    content: {type: graphql.GraphQLString},
    done: {type: graphql.GraphQLBoolean}
  }
})

// define the queries of the graphql Schema
const query = new graphql.GraphQLObjectType({
  name: 'TodoQuery',
  fields: {
    todo: {
      type: new graphql.GraphQLList(TodoType),
      args: {
        _id: {
          type: graphql.GraphQLString
        }
      },
      resolve: (_, {_id}) => {
        const where = _id ? {_id} : {};
        return Todo.find(where);
      }
    }
  }
})



// define the mutations of the graphql Schema
const mutation = new graphql.GraphQLObjectType({
  name: 'TodoMutation',
  fields: {
    createTodo: {
      type: TodoType,
      args: {
        content: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
      },
      resolve: (_, {content}) => {
        const newTodo = new Todo({content, done: false});
        return newTodo.save()
      }
    },
    checkTodo: {
      type: new graphql.GraphQLList(TodoType),
      args: {
        _id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
      },
      resolve: (_, {_id}) => {
        return Todo.findById(_id)
        .then(todo => {
          todo.done = true;
          return todo.save();
        });
      }
    },
    deleteTodo: {
      type: new graphql.GraphQLList(TodoType),
      args: {
        _id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
      },
      resolve: (_, {_id}) => {
        return Todo.findOneAndRemove(_id)
      }
    }
  }
})
// creates and exports the GraphQL Schema
module.exports = new graphql.GraphQLSchema({
  query,
  mutation
})
