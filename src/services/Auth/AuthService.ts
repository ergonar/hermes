import { Service } from 'typedi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { JWTInterface, JWTUserPayloadInterface } from './JWTInterface';
import UserInterface from '../../models/User/UserInterface';
import UserDocument from '../../models/User/UserDocument';
import User from '../../models/User/user';
import logger from '../../utils/winston';
import config from '../../config';

@Service()
class AuthService {
  public async signup(
    userData: UserInterface
  ): Promise<{ user: UserInterface; token: string }> {
    try {
      let userDocument = User.build(userData);
      await userDocument.save();
      const token = this.generateToken(userDocument);

      const user = userDocument.toObject();
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'active');

      return { user, token };
    } catch (error) {
      throw new Error('Error while signing up user. ' + error.message);
    }
  }

  public async signin(
    email: string,
    password: string
  ): Promise<{ user: UserInterface; token: string }> {
    try {
      const userDocument = await User.findOne({ email })
        .select('+password')
        .exec();
      const passwordIsCorrect = await bcrypt.compare(
        password,
        userDocument.password
      );

      if (!passwordIsCorrect) {
        throw new Error('Incorrect email or password');
      }

      const token = this.generateToken(userDocument);

      const user = userDocument.toObject();
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'active');

      return { user, token };
    } catch (error) {
      logger.error('Error while signing in: ' + error.message);
      throw new Error('Error while signing in: ' + error.message);
    }
  }

  public forgotPassword() {}
  public resetPassword() {}

  private generateToken(user: UserDocument) {
    const payload: JWTUserPayloadInterface = {
      _id: user.id,
      name: user.username,
    };
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
  }

  public async decodeToken(token: string): Promise<JWTInterface> {
    return await jwt.verify(token, config.jwtSecret);
  }
}

export default AuthService;

// signin / login
// logout
// protect routes
// restrict middleware
// forgot password
// reset password
