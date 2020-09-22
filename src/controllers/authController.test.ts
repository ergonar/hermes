import request from 'supertest';

import app from './../app';
import config from './../config';
import logger from '../utils/winston';
import UserInterface from '../models/User/UserInterface';
import User from './../models/User/user';
import {
  createCorrectSignupUserMock,
  createIncompleteSignupUserMock,
} from '../../test/mock/authMock';

describe('Authenticate Users', () => {
  let server;
  const url = `${config.api.prefix}/auth/signup`;

  beforeAll(async () => {
    try {
      server = await app;
    } catch (error) {
      logger.error('Error while initializing the server', error);
    }
  });

  describe('/signup', () => {
    describe('Method: POST', () => {
      it('should create a user and receive the created user and its token', async () => {
        expect.assertions(7);
        const user: UserInterface = createCorrectSignupUserMock();
        const response = await request(server).post(url).send({ user });

        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('User created successfully!');
        expect(response.body.user).toBeDefined();
        expect(response.body.user.username).toBe(user.username);
        expect(response.body.user.email).toBe(user.email.toLowerCase());
        expect(response.body.token).toBeDefined();

        await User.findByIdAndDelete(response.body.user._id);
      });

      it('should receive validation error when sending incomplete information', async () => {
        expect.assertions(8);
        const user = createIncompleteSignupUserMock();
        const response = await request(server).post(url).send({ user });

        expect(response.statusCode).toBe(500);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toMatch(
          'Error while signing up user. User validation failed:'
        );
        expect(response.body.user).toBeUndefined();
        expect(response.body.token).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.statusCode).toBe(500);
        expect(response.body.error.status).toBe('error');
      });
    });
  });
});
