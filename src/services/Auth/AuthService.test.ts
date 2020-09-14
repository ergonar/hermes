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

describe('Sign up a user', () => {
  let connection;

  beforeAll(async () => {
    connection = await mongooseLoader(config.mongoTestUrl);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should signup a user and create its token', async () => {
    expect.assertions(3);
    const authService = Container.get(AuthService);
    const userMock = createCorrectUserMock();
    const { user, token } = await authService.signup(userMock);

    expect(user.id).toBeDefined();
    expect(user.username).toBeDefined();
    expect(token).toBeDefined();
  });

  it('should fail to signup a non existing user', async () => {
    expect.assertions(3);
    try {
      const authService = Container.get(AuthService);
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
    const authService = Container.get(AuthService);
    const decodedToken = await authService.decodeToken(token);

    expect(decodedToken.id).toBe(user.id);
    expect(decodedToken.name).toBe(user.username);
    expect(decodedToken.iat).toBeDefined();
    expect(decodedToken.exp).toBeDefined();
  });

  it('should throw error when decoding token with a tampered header', async () => {
    expect.assertions(4);
    try {
      const authService = Container.get(AuthService);
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
      const authService = Container.get(AuthService);
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
      const authService = Container.get(AuthService);
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
});
