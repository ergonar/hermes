import faker from 'faker';

import UserInterface from '../../src/models/User/UserInterface';

export const createCorrectUserMock = (): UserInterface => {
  const password = faker.internet.password();
  return {
    username: faker.name.findName(),
    password: password,
    passwordConfirm: password,
    email: faker.internet.email(),
    passwordResetToken: 'passwordResetToken',
    passwordResetExpires: faker.date.recent().toString(),
  };
};

export const createUserMockWithIncorrectEmail = (): UserInterface => {
  const password = faker.internet.password();
  return {
    username: faker.name.findName(),
    password: password,
    passwordConfirm: password,
    email: 'incorrectEmail.com',
    passwordResetToken: 'passwordResetToken',
    passwordResetExpires: faker.date.recent(),
  };
};

export const createUserMockWithIncorrectPasswords = (): UserInterface => {
  const password = faker.internet.password();
  return {
    username: faker.name.findName(),
    password: password,
    passwordConfirm: password + password,
    email: faker.internet.email(),
    passwordResetToken: 'passwordResetToken',
    passwordResetExpires: faker.date.recent(),
  };
};
