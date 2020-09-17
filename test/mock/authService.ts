import Container from 'typedi';
import User from '../../src/models/User/user';
import UserDocument from '../../src/models/User/UserDocument';
import UserInterface from '../../src/models/User/UserInterface';
import AuthService from '../../src/services/Auth/AuthService';
import { createCorrectUserMock } from './userMock';

export const createSignupUserMock = async (): Promise<{
  user: UserDocument;
  userMock: UserInterface;
  token: string;
}> => {
  try {
    const authService = Container.get(AuthService);
    const userMock = createCorrectUserMock();
    const { user: createdUser, token } = await authService.signup(userMock);

    const user = await User.findOne({ _id: createdUser._id })
      .select('+password')
      .exec();
    return { user, userMock, token };
  } catch (error) {
    throw new Error('Error while creating signup user mock. ' + error.message);
  }
};
