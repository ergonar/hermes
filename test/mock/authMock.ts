import faker from 'faker';

import UserInterface from '../../src/models/User/UserInterface';

export const createCorrectSignupUserMock = (): UserInterface => {
  const password = faker.internet.password();
  return {
    username: faker.name.findName(),
    password: password,
    passwordConfirm: password,
    email: faker.internet.email(),
  };
};

export const createIncompleteSignupUserMock = () => {
  const password = faker.internet.password();
  return {
    // username: faker.name.findName(),
    // password: password,
    // passwordConfirm: password,
    email: faker.internet.email(),
  };
};
