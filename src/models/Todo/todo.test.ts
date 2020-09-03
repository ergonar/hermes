import { mongooseConnection as mongooseLoader } from './../../loaders/mongoose';
import config from './../../config';

describe('insert', () => {
  let connection;
  let database;

  beforeAll(async () => {
    connection = await mongooseLoader(config.mongoTestUrl);
    database = connection.connection.db;
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should insert a doc into collection', async () => {
    expect.assertions(1);
    const users = database.collection('users');

    const mockUser = { _id: 'some-user-id', name: 'John' };
    const user = await users.insertOne(mockUser);

    const insertedUser = await users.findOne({ _id: 'some-user-id' });
    expect(insertedUser).toEqual(mockUser);
  });
});
