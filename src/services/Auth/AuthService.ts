import jwt from 'jsonwebtoken';
import { Service } from 'typedi';

import UserInterface from '../../models/User/UserInterface';
import User from '../../models/User/user';
import UserDocument from '../../models/User/UserDocument';
import config from '../../config';
import { JWTInterface, JWTUserPayloadInterface } from './JWTInterface';

@Service()
class AuthService {
  public async decodeToken(token: string): Promise<JWTInterface> {
    return await jwt.verify(token, config.jwtSecret);
  }

  public async signup(
    userData: UserInterface
  ): Promise<{ user: UserDocument; token: string }> {
    try {
      const user = User.build(userData);
      await user.save();
      const token = this.generateToken(user);

      return { user, token };
    } catch (error) {
      throw new Error('Error while signing up user. ' + error.message);
    }
  }

  private generateToken(user: UserDocument) {
    const payload: JWTUserPayloadInterface = {
      id: user.id,
      name: user.username,
    };
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
  }
}

export default AuthService;

// signin / login
// logout
// protect routes
// restrict middleware
// forgot password
// reset password
