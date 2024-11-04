const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLID } = require('graphql');
const Task = require('./models/Task');

const TaskType = new GraphQLObjectType({
    name: 'Task',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        dueDate: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        tasks: {
            type: new GraphQLList(TaskType),
            resolve() {
                return Task.find();
            }
        },
        task: {
            type: TaskType,
            args: { id: { type: GraphQLID } },
            resolve(_, args) {
                return Task.findById(args.id);
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addTask: {
            type: TaskType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLString },
                status: { type: GraphQLString },
                dueDate: { type: GraphQLString }
            },
            resolve(_, args) {
                const task = new Task(args);
                return task.save();
            }
        },
        updateTask: {
            type: TaskType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                title: { type: GraphQLString },
                description: { type: GraphQLString },
                status: { type: GraphQLString },
                dueDate: { type: GraphQLString }
            },
            resolve(_, args) {
                return Task.findByIdAndUpdate(args.id, args, { new: true });
            }
        },
        deleteTask  : {
            type: GraphQLString,  // Change type to GraphQLString to return a message
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            async resolve(_, { id }) {
                try {
                    const task = await Task.findByIdAndRemove(id);
                    if (!task) {
                        return `Task with ID ${id} not found.`;
                    }
                    return `Task with ID ${id} has been deleted successfully.`;
                } catch (error) {
                    console.error("Error deleting task:", error);
                    return "An error occurred while trying to delete the task.";
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
