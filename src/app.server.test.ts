import request from 'supertest';
import app from './app';

describe('Test the root path', () => {
  let server;

  beforeAll(async () => {
    try {
      server = await app;
    } catch (error) {
      console.log(error);
    }
  });

  afterAll(async () => {
    try {
      await server.close();
    } catch (error) {
      console.log('Error while closing the server', error);
    }
  });

  it('should call GET method with state of 200', async () => {
    expect.assertions(1);
    const response = await request(server).get('/api/first/hey');
    expect(response.statusCode).toBe(200);
  });

  it('should call GET method and receive "Hello world" as data', async () => {
    expect.assertions(1);
    const response = await request(server).get('/api/first/hey');
    expect(response.body.message).toBe('Hello Typescript');
  });
});
