import { Container } from 'typedi';
import JsonWebTokenError from 'jsonwebtoken/lib/JsonWebTokenError';

import { mongooseConnection as mongooseLoader } from '../../loaders/mongoose';

import config from '../../config';
import User from '../../models/User/user';
import {
  createCorrectUserMock,
  createUserMockWithIncorrectEmail,
} from '../../../test/mock/userMock';
import AuthService from './AuthService';
import { createSignupUserMock as createCorrectSignupUserMock } from '../../../test/mock/authService';
import logger from '../../utils/winston';

describe('Sign up a user', () => {
  let connection;
  let authService: AuthService;

  beforeAll(async () => {
    connection = await mongooseLoader(config.mongoTestUrl);
    authService = Container.get(AuthService);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should signup a user and create its token', async () => {
    expect.assertions(3);
    const userMock = createCorrectUserMock();
    const { user, token } = await authService.signup(userMock);

    expect(user._id).toBeDefined();
    expect(user.username).toBeDefined();
    expect(token).toBeDefined();
  });

  it('should fail to signup a non existing user', async () => {
    expect.assertions(3);
    try {
      const userMock = createUserMockWithIncorrectEmail();
      await authService.signup(userMock);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toMatch('Error while signing up user');
    }
  });

  it('should decode user token successfully', async () => {
    expect.assertions(4);
    const { user, token } = await createCorrectSignupUserMock();
    const decodedToken = await authService.decodeToken(token);

    expect(decodedToken._id).toBe(user._id.toString());
    expect(decodedToken.name).toBe(user.username);
    expect(decodedToken.iat).toBeDefined();
    expect(decodedToken.exp).toBeDefined();
  });

  it('should throw error when decoding token with a tampered header', async () => {
    expect.assertions(4);
    try {
      let { token } = await createCorrectSignupUserMock();
      const [header, payload, verifySignature] = token.split('.');
      const tamperedHeader = header + 'TAMPERED-HEADER';

      const tamperedToken = [tamperedHeader, payload, verifySignature].join(
        '.'
      );

      await authService.decodeToken(tamperedToken);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(JsonWebTokenError);
      expect(error.name).toContain('JsonWebTokenError');
      expect(error.message).toBe('invalid token');
    }
  });

  it('should throw error when decoding token with a tampered payload', async () => {
    expect.assertions(2);
    try {
      let { token } = await createCorrectSignupUserMock();
      const [header, payload, verifySignature] = token.split('.');
      const tamperedPayload = payload + 'TAMPERED-PAYLOAD';

      const tamperedToken = [header, tamperedPayload, verifySignature].join(
        '.'
      );

      await authService.decodeToken(tamperedToken);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(SyntaxError);
    }
  });

  it('should throw error when decoding token with a tampered verify signature', async () => {
    expect.assertions(4);
    try {
      let { token } = await createCorrectSignupUserMock();
      const [header, payload, verifySignature] = token.split('.');
      const tamperedVerifySignature =
        verifySignature + 'TAMPERED-VERIFY-SIGNATURE';

      const tamperedToken = [header, payload, tamperedVerifySignature].join(
        '.'
      );

      await authService.decodeToken(tamperedToken);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(JsonWebTokenError);
      expect(error.name).toContain('JsonWebTokenError');
      expect(error.message).toBe('invalid signature');
    }
  });

  it('should signin user with correct email and password', async () => {
    expect.assertions(6);
    const {
      user: registeredUser,
      userMock,
    } = await createCorrectSignupUserMock();
    const { user, token } = await authService.signin(
      userMock.email,
      userMock.password
    );

    expect(user).toBeDefined();
    expect(user._id.toString()).toBe(registeredUser.id);
    expect(user.email).toBe(registeredUser.email);
    expect(user.password).toBeUndefined();
    expect(user.active).toBeUndefined();
    expect(token).toBeDefined();
  });

  it('should throw error with undefined email', async () => {
    expect.assertions(2);
    try {
      await authService.signin(undefined, undefined);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toMatch('Error while signing in');
    }
  });

  it('should throw error with undefined email and password', async () => {
    expect.assertions(2);
    try {
      const { user: registeredUser } = await createCorrectSignupUserMock();
      await authService.signin(registeredUser.email, undefined);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toMatch('Error while signing in');
    }
  });

  it('should throw error with incorrect passwords', async () => {
    expect.assertions(2);
    try {
      const { user: registeredUser } = await createCorrectSignupUserMock();
      await authService.signin(registeredUser.email, 'TAMPERED-PASSWORD');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toMatch('Incorrect email or password');
    }
  });
});
