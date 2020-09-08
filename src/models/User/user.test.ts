import mongoose from 'mongoose';

import { mongooseConnection as mongooseLoader } from './../../loaders/mongoose';

import config from './../../config';
import User from './user';

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
    const user = User.build(completeUserMock);
    await user.save();

    const savedUser = await User.findOne({
      username: completeUserMock.username,
    });

    expect(savedUser._id).toBeDefined();
    expect(savedUser.createdAt).toBeDefined();
    expect(savedUser.updatedAt).toBeDefined();
    expect(savedUser.active).toBeFalsy();
    expect(savedUser.username).toBe(completeUserMock.username);
    expect(savedUser.password).toBeUndefined();
    expect(savedUser.passwordConfirm).toBeUndefined();
    expect(savedUser.email).toBe(completeUserMock.email);
    expect(savedUser.passwordResetToken).toBe(
      completeUserMock.passwordResetToken
    );
    expect(savedUser.passwordResetExpires).toStrictEqual(
      completeUserMock.passwordResetExpires
    );
  });
  it('should fail when password and passwordConfirm are different', async () => {
    expect.assertions(1);
    const user = User.build(mismatchPasswordsMock);

    await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should fail when given an incorrect email', async () => {
    expect.assertions(1);
    const user = User.build(incorrectEmailFormatMock);

    await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should correctly hash the created user password', async () => {
    expect.assertions(3);
    const user = User.build(completeUserMock);
    await user.save();

    const savedUser = await User.findOne({
      username: completeUserMock.username,
    }).select('+password');

    const userPasswordIsCorrect = savedUser.correctPassword(
      completeUserMock.password,
      savedUser.password
    );

    expect(savedUser.password).toBeDefined();
    expect(savedUser.password).not.toBe(completeUserMock.password);
    expect(userPasswordIsCorrect).toBeTruthy();
  });

  const completeUserMock = {
    username: 'John',
    password: 'somePassword',
    passwordConfirm: 'somePassword',
    email: 'email@email.com',
    passwordResetToken: 'passwordResetToken',
    passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000), // Ten days from now on
  };

  const mismatchPasswordsMock = {
    username: 'John',
    password: 'somePassword',
    passwordConfirm: 'aDifferentPassword',
    email: 'email@email.com',
    passwordResetToken: 'passwordResetToken',
    passwordResetExpires: new Date(),
  };

  const incorrectEmailFormatMock = {
    username: 'John',
    password: 'somePassword',
    passwordConfirm: 'somePassword',
    email: 'emailemail.com',
    passwordResetToken: 'passwordResetToken',
    passwordResetExpires: new Date(),
  };
});
