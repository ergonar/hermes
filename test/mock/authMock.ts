import faker from 'faker';
import { Response } from 'express';
import setCookie from 'set-cookie-parser';

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

export const createJWTExpirationDateMocks = () => {
  const today = new Date();
  let eightyNinthDay = new Date();
  let ninetyFirstDay = new Date();
  eightyNinthDay.setDate(today.getDate() + 89);
  ninetyFirstDay.setDate(today.getDate() + 91);

  return { eightyNinthDay, ninetyFirstDay };
};

export const getJWTCookieFromResponse = (response: Response) => {
  const cookies = setCookie.parse(response, {
    decodeValues: true,
  });
  const jwtCookie = cookies.find(cookie => {
    if (cookie.name === 'jwt') {
      return cookie;
    }
  });

  return jwtCookie;
};
