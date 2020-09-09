import mongoose from 'mongoose';

import { mongooseConnection as mongooseLoader } from './../../loaders/mongoose';

import config from './../../config';
import User from './user';
import {
  createCorrectUserMock,
  createUserMockWithIncorrectEmail,
  createUserMockWithIncorrectPasswords,
} from '../../../test/mock/userMock';

describe('Insert Users', () => {
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

  it('should create and save a user successfully', async () => {
    expect.assertions(10);
    const userMock = createCorrectUserMock();
    const user = User.build(userMock);
    await user.save();

    const savedUser = await User.findOne({
      username: userMock.username,
    });

    expect(savedUser._id).toBeDefined();
    expect(savedUser.createdAt).toBeDefined();
    expect(savedUser.updatedAt).toBeDefined();
    expect(savedUser.active).toBeFalsy();
    expect(savedUser.username).toBe(userMock.username);
    expect(savedUser.password).toBeUndefined();
    expect(savedUser.passwordConfirm).toBeUndefined();
    expect(savedUser.email).toBe(userMock.email.toLowerCase());
    expect(savedUser.passwordResetToken).toBe(userMock.passwordResetToken);
    expect(savedUser.passwordResetExpires).toStrictEqual(
      userMock.passwordResetExpires
    );
  });
  it('should fail when password and passwordConfirm are different', async () => {
    expect.assertions(1);
    const userMock = createUserMockWithIncorrectPasswords();
    const user = User.build(userMock);

    await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should fail when given an incorrect email', async () => {
    expect.assertions(1);
    const userMock = createUserMockWithIncorrectEmail();
    const user = User.build(userMock);

    await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should correctly hash the created user password', async () => {
    expect.assertions(3);
    const userMock = createCorrectUserMock();
    const user = User.build(userMock);
    await user.save();

    const savedUser = await User.findOne({
      username: userMock.username,
    }).select('+password');

    const userPasswordIsCorrect = savedUser.correctPassword(
      userMock.password,
      savedUser.password
    );

    expect(savedUser.password).toBeDefined();
    expect(savedUser.password).not.toBe(userMock.password);
    expect(userPasswordIsCorrect).toBeTruthy();
  });
});
