import { Request, Response } from 'express';
import { Service } from 'typedi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { JWTInterface, JWTUserPayloadInterface } from './JWTInterface';
import UserInterface from '../../models/User/UserInterface';
import UserDocument from '../../models/User/UserDocument';
import User from '../../models/User/user';
import config from '../../config';
import APIError from '../../utils/ApiError';

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
      throw new APIError(400, `Error while signing up user. ${error.message}`);
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
      if (!userDocument) {
        throw new APIError(400, 'Incorrect email or password');
      }

      const passwordIsCorrect = await bcrypt.compare(
        password,
        userDocument.password
      );

      if (!passwordIsCorrect) {
        throw new APIError(400, 'Incorrect email or password');
      }

      const token = this.generateToken(userDocument);

      const user = userDocument.toObject();
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'active');

      return { user, token };
    } catch (error) {
      throw new APIError(400, `Error while signing in: ${error.message}`);
    }
  }

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

  public setJWTCookieToResponse(
    token: string,
    req: Request,
    res: Response
  ): void {
    try {
      const cookieOptions = {
        expires: new Date(
          Date.now() + config.jwtCookieExpiresIn * config.daysToMs
        ),
        httpOnly: true, // Cannot be accessed or modified in the browser
        secure: req.secure || req.header('x-forwarded-proto') === 'https',
      };

      res.cookie('jwt', token, cookieOptions);
    } catch (error) {
      throw new APIError(
        400,
        `Error while setting jwt cookie: ${error.message}`
      );
    }
  }
}

export default AuthService;
