import { mongooseConnection as mongooseLoader } from './../../loaders/mongoose';

import config from './../../config';
import Todo from './todo';

describe('Code base for testing mongoose schema', () => {
  let connection;
  let database;

  beforeAll(async () => {
    connection = await mongooseLoader(config.mongoTestUrl);
    database = connection.connection.db;
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should create and save todo successfully', async () => {
    expect.assertions(3);
    const mockTodo = {
      title: 'Some Title',
      description: 'Some Description',
    };
    const todo = Todo.build(mockTodo);
    await todo.save();

    const savedTodo = await Todo.findOne({ title: 'Some Title' });
    expect(savedTodo._id).toBeDefined();
    expect(savedTodo.title).toBe(mockTodo.title);
    expect(savedTodo.description).toBe(mockTodo.description);
  });
});
