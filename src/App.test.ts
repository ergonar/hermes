import request from 'supertest';
import app from './app';

describe('Test the root path', () => {
  let server;

  beforeAll(() => {
    app
      .then(appServer => (server = appServer))
      .catch(error => console.log(error));
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
