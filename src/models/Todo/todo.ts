import mongoose from 'mongoose';

import TodoInterface from './TodoInterface';
import TodoDocument from './TodoDocument';
import TodoModel from './TodoModel';

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

todoSchema.statics.build = (attr: TodoInterface) => {
  return new Todo(attr);
};

const Todo = mongoose.model<TodoDocument, TodoModel>('Todo', todoSchema);

export default Todo;
