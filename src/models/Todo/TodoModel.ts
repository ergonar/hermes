import mongoose from 'mongoose';

import TodoInterface from './TodoInterface';
import TodoDocument from './TodoDocument';

interface TodoModel extends mongoose.Model<TodoDocument> {
  build(attr: TodoInterface): TodoDocument;
}

export default TodoModel;
