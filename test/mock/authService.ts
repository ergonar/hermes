import Container from 'typedi';
import UserDocument from '../../src/models/User/UserDocument';
import AuthService from '../../src/services/Auth/AuthService';
import { createCorrectUserMock } from './userMock';

export const createSignupUserMock = async (): Promise<{
  user: UserDocument;
  token: string;
}> => {
  const authService = Container.get(AuthService);
  const userMock = createCorrectUserMock();
  const { user, token } = await authService.signup(userMock);
  return { user, token };
};
