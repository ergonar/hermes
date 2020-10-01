import request from 'supertest';
import mocks from 'node-mocks-http';
import JsonWebTokenError from 'jsonwebtoken/lib/JsonWebTokenError';

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
import * as authController from './authController';
import Container from 'typedi';
import AuthService from '../services/Auth/AuthService';
import APIError from '../utils/ApiError';
import { createSignupUserMock } from '../../test/mock/authService';
import { Error } from 'mongoose';
import { createCorrectUserMock } from '../../test/mock/userMock';

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
      const response = await request(server)
        .post(signupUrl)
        .send({ user: userMock });
      user = response.body.user;
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

  describe('logout', () => {
    it('should expire the jwt cookie', async () => {
      expect.assertions(7);
      const request = mocks.createRequest();
      const response = mocks.createResponse();
      const next = jest.fn();

      const authService = Container.get(AuthService);
      const token = 'testToken';
      authService.setJWTCookieToResponse(token, request, response);

      authController.logout(request, response, next);

      expect(response.statusCode).toBe(200);
      expect(response.cookies.jwt).toBeDefined();
      expect(response.cookies.jwt.value).toBe('loggedout');
      expect(response.cookies.jwt.options.expires).toBeDefined();
      // The cookie should expire around this minute, instead of 90 days from now
      expect(
        response.cookies.jwt.options.expires.getMinutes()
      ).toBeLessThanOrEqual(new Date().getMinutes() + 1);
      expect(
        response.cookies.jwt.options.expires.getMinutes()
      ).toBeGreaterThanOrEqual(new Date().getMinutes() - 1);
      expect(response.cookies.jwt.options.httpOnly).toBeTruthy();
    });
  });

  describe('protect', () => {
    let user;
    let token;
    let userMock;

    beforeAll(async () => {
      // Creating a mock user
      const {
        user: createdUser,
        token: createdToken,
      } = await createSignupUserMock();
      user = createdUser;
      token = createdToken;
    });

    afterAll(async () => {
      await User.findByIdAndDelete(user._id);
    });

    it('should call next when sending correct token in the Request and the user exists', async () => {
      expect.assertions(2);
      const request = mocks.createRequest();
      const response = mocks.createResponse();
      const next = jest.fn();

      request.cookies.jwt = token;
      await authController.protect(request, response, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith();
    });

    it('should throw error when not sending token in the Request', async () => {
      expect.assertions(1);
      const request = mocks.createRequest();
      const response = mocks.createResponse();
      const next = jest.fn();

      await authController.protect(request, response, next);

      expect(next).toHaveBeenCalledWith(
        new APIError(401, 'You are not logged in. Please log in to get access.')
      );
    });

    it('should throw error when sending an invalid token in the Request', async () => {
      expect.assertions(2);
      const request = mocks.createRequest();
      const response = mocks.createResponse();
      const next = jest.fn();

      request.cookies.jwt = token + '.tampering.token';
      await authController.protect(request, response, next);

      // Expecting invalid token error given by GlobalErrorHandler
      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(new JsonWebTokenError('jwt malformed'));
    });

    it('should throw error when sending a valid token in the Request but the user does not exist', async () => {
      expect.assertions(1);
      const request = mocks.createRequest();
      const response = mocks.createResponse();
      const next = jest.fn();

      const {
        user: userToDelete,
        token: deletedUserToken,
      } = await createSignupUserMock();
      await User.findByIdAndDelete(userToDelete._id);

      request.cookies.jwt = deletedUserToken;
      await authController.protect(request, response, next);

      expect(next).toHaveBeenCalledWith(
        new APIError(401, 'The user belonging to this token no longer exists.')
      );
    });

    it('should throw error when sending a valid token in the Request but the user password was changed after the token was created', async () => {
      expect.assertions(1);
      const request = mocks.createRequest();
      const response = mocks.createResponse();
      const next = jest.fn();

      const {
        user: userToChangePassword,
        token: correctToken,
      } = await createSignupUserMock();

      userToChangePassword.password = 'New Password';
      userToChangePassword.passwordConfirm = 'New Password';
      await userToChangePassword.save();

      request.cookies.jwt = correctToken;
      await authController.protect(request, response, next);

      expect(next).toHaveBeenCalledWith(
        new APIError(
          401,
          'The user recently changed its password! Please log in again.'
        )
      );
    });
  });
});
