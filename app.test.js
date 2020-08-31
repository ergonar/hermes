const request = require('supertest');
const path = require('path');
const app = require('./../../app.js');

describe('Test the root path', () => {
  test('It should response the GET method with state of 200', () => {
    return request(app).get('/').expect(200);
  });

  test('it should response the GET method with "Hello world"', () => {
    return request(app).get('/').expect.toBe('Hello World');
  });
});
