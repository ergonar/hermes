import request from 'supertest';
import app from '../../app';
import config from '../../config';
import logger from '../../utils/winston';

describe('Test the auth routes', () => {
  let server;

  beforeAll(async () => {
    try {
      server = await app;
    } catch (error) {
      logger.error('Error while initializing the server', error);
    }
  });

  afterAll(async () => {
    try {
      await server.close();
    } catch (error) {
      logger.error('Error while closing the server', error);
    }
  });

  it('should return an APIError when using GET to access an undefined url', async () => {
    expect.assertions(5);
    const url = `${config.api.prefix}/undefined/url/`;
    const response = await request(server).get(url);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('fail');
    expect(response.body.error).toBeDefined();
    expect(response.body.message).toBe(`Can't find ${url} on this server`);
    expect(response.body.stack).toBeDefined();
  });
});
