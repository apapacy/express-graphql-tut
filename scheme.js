const graphql = require('graphql')

const fakeDatabase = {};

class Todo {
  /**
  * Todo constructor
  * @param {String} content Text that describes the task to do
  */
  constructor(content) {
    this.id = ++Todo.counter;
    this.content = content;
    this.done = false;
  }
}

// counter of instances
Todo.counter = 0;

// define the Todo type for graphql
const TodoType = new graphql.GraphQLObjectType({
  name: 'todo',
  description: 'a todo item',
  fields: {
    id: {type: graphql.GraphQLInt},
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
        id: {
          type: graphql.GraphQLInt
        }
      },
      resolve: (_, {id}) => {
      console.log(arguments);
        if (id)
          return [fakeDatabase[id]];
        return Object.values(fakeDatabase);
      }
    }
  }
})



// define the mutations of the graphql Schema
const mutation = new graphql.GraphQLObjectType({
  name: 'TodoMutation',
  fields: {
    createTodo: {
      type: new graphql.GraphQLList(TodoType),
      args: {
        content: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
      },
      resolve: (_, {content}) => {
        const newTodo = new Todo(content);
        fakeDatabase[newTodo.id] = newTodo;
        return Object.values(fakeDatabase);
      }
    },
    checkTodo: {
      type: new graphql.GraphQLList(TodoType),
      args: {
        id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
        }
      },
      resolve: (_, {id}) => {
        fakeDatabase[id].done = true;
        return Object.values(fakeDatabase);
      }
    },
    deleteTodo: {
      type: new graphql.GraphQLList(TodoType),
      args: {
        id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
        }
      },
      resolve: (_, {id}) => {
        delete fakeDatabase[id];
        return Object.values(fakeDatabase);
      }
    }
  }
})
// creates and exports the GraphQL Schema
module.exports = new graphql.GraphQLSchema({
  query,
  mutation
})
