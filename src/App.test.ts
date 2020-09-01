import * as request from 'supertest';
import app from './App';

describe('Test the root path', () => {
  it('should call GET method with state of 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  it('should call GET method and receive "Hello world" as data', async () => {
    const response = await request(app).get('/');
    expect(response.text).toContain('Hello Typescript');
  });
});
