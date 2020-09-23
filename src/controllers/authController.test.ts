import request from 'supertest';

import app from './../app';
import config from './../config';
import logger from '../utils/winston';
import UserInterface from '../models/User/UserInterface';
import User from './../models/User/user';
import {
  createCorrectSignupUserMock,
  createIncompleteSignupUserMock,
  createJWTExpirationDateMocks,
  getJWTCookieFromResponse,
} from '../../test/mock/authMock';

describe('Authenticate Users', () => {
  let server;
  const baseUrl = `${config.api.prefix}/auth`;
  const signupUrl = `${baseUrl}/signup`;
  const signinUrl = `${baseUrl}/signin`;

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

  describe('/signup', () => {
    describe('Method: POST', () => {
      it('should create a user and receive the created user and its token', async () => {
        expect.assertions(7);
        const user: UserInterface = createCorrectSignupUserMock();
        const response = await request(server).post(signupUrl).send({ user });

        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('User created successfully!');
        expect(response.body.user).toBeDefined();
        expect(response.body.user.username).toBe(user.username);
        expect(response.body.user.email).toBe(user.email.toLowerCase());
        expect(response.body.token).toBeDefined();

        await User.findByIdAndDelete(response.body.user._id);
      });

      it('should create a user and have a jwt cookie in the response', async () => {
        expect.assertions(5);
        const user: UserInterface = createCorrectSignupUserMock();
        const response = await request(server).post(signupUrl).send({ user });
        const jwtCookie = getJWTCookieFromResponse(response);
        const {
          eightyNinthDay,
          ninetyFirstDay,
        } = createJWTExpirationDateMocks();

        expect(jwtCookie).toBeDefined();
        expect(jwtCookie.value).toBe(response.body.token);
        expect(jwtCookie.httpOnly).toBeTruthy();
        // jwt expire date should be in 90 days
        expect(jwtCookie.expires.getTime()).toBeGreaterThan(
          eightyNinthDay.getTime()
        );
        expect(jwtCookie.expires.getTime()).toBeLessThan(
          ninetyFirstDay.getTime()
        );

        await User.findByIdAndDelete(response.body.user._id);
      });

      it('should receive validation error when sending incomplete information', async () => {
        expect.assertions(8);
        const user = createIncompleteSignupUserMock();
        const response = await request(server).post(signupUrl).send({ user });

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe('fail');
        expect(response.body.message).toMatch(
          'Error while signing up user. User validation failed:'
        );
        expect(response.body.user).toBeUndefined();
        expect(response.body.token).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.statusCode).toBe(400);
        expect(response.body.error.status).toBe('fail');
      });

      it('should receive validation error when not sending data', async () => {
        expect.assertions(8);
        const user = undefined;
        const response = await request(server).post(signupUrl).send({ user });

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe('fail');
        expect(response.body.message).toMatch(
          'Error while signing up user. User validation failed:'
        );
        expect(response.body.user).toBeUndefined();
        expect(response.body.token).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.statusCode).toBe(400);
        expect(response.body.error.status).toBe('fail');
      });
    });
  });

  describe('/signin', () => {
    let user;
    let userMock;

    beforeAll(async () => {
      // Creating a mock user
      userMock = createCorrectSignupUserMock();
      await request(server).post(signupUrl).send({ user: userMock });
    });

    afterAll(async () => {
      await User.findByIdAndDelete(user._id);
    });

    describe('Method: POST', () => {
      it('should signin a user with correct email and password and receive user and token', async () => {
        expect.assertions(7);
        const response = await request(server)
          .post(signinUrl)
          .send({ email: userMock.email, password: userMock.password });

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('User signed in successfully!');
        expect(response.body.user).toBeDefined();
        expect(response.body.user.username).toBe(userMock.username);
        expect(response.body.user.email).toBe(userMock.email.toLowerCase());
        expect(response.body.token).toBeDefined();
      });

      it('should signin a user and have a jwt cookie in the response', async () => {
        expect.assertions(5);
        const response = await request(server)
          .post(signinUrl)
          .send({ email: userMock.email, password: userMock.password });
        const jwtCookie = getJWTCookieFromResponse(response);
        const {
          eightyNinthDay,
          ninetyFirstDay,
        } = createJWTExpirationDateMocks();

        expect(jwtCookie).toBeDefined();
        expect(jwtCookie.value).toBe(response.body.token);
        expect(jwtCookie.httpOnly).toBeTruthy();
        // jwt expire date should be in 90 days
        expect(jwtCookie.expires.getTime()).toBeGreaterThan(
          eightyNinthDay.getTime()
        );
        expect(jwtCookie.expires.getTime()).toBeLessThan(
          ninetyFirstDay.getTime()
        );
      });

      it('should throw error if a password is given but an email is not', async () => {
        expect.assertions(8);
        const response = await request(server).post(signinUrl).send({
          password: userMock.password,
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe('fail');
        expect(response.body.message).toBe(
          'Please provide an email and password'
        );
        expect(response.body.stack).toBeDefined();
        expect(response.body.user).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.statusCode).toBe(400);
        expect(response.body.error.status).toBe('fail');
      });

      it('should throw error if an email is given but a password is not', async () => {
        expect.assertions(8);
        const response = await request(server).post(signinUrl).send({
          email: userMock.email,
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe('fail');
        expect(response.body.message).toBe(
          'Please provide an email and password'
        );
        expect(response.body.stack).toBeDefined();
        expect(response.body.user).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.statusCode).toBe(400);
        expect(response.body.error.status).toBe('fail');
      });

      it('should throw error if no data is sent', async () => {
        expect.assertions(8);
        const response = await request(server).post(signinUrl);

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe('fail');
        expect(response.body.message).toBe(
          'Please provide an email and password'
        );
        expect(response.body.stack).toBeDefined();
        expect(response.body.user).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.statusCode).toBe(400);
        expect(response.body.error.status).toBe('fail');
      });

      it('should not signin a user with an incorrect email', async () => {
        expect.assertions(8);
        const incorrectEmail = 'incorrectMail@gmail.com';
        const response = await request(server).post(signinUrl).send({
          email: incorrectEmail,
          password: userMock.password,
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe('fail');
        expect(response.body.message).toBe(
          'Error while signing in: Incorrect email or password'
        );
        expect(response.body.stack).toBeDefined();
        expect(response.body.user).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.statusCode).toBe(400);
        expect(response.body.error.status).toBe('fail');
      });

      it('should not signin a user with an incorrect password', async () => {
        expect.assertions(8);
        const incorrectPassword = 'incorrectPassword';
        const response = await request(server).post(signinUrl).send({
          email: userMock.email,
          password: incorrectPassword,
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe('fail');
        expect(response.body.message).toBe(
          'Error while signing in: Incorrect email or password'
        );
        expect(response.body.stack).toBeDefined();
        expect(response.body.user).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.statusCode).toBe(400);
        expect(response.body.error.status).toBe('fail');
      });
    });
  });
});
