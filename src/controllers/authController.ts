import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
import User from '../models/User/user';
import UserInterface from '../models/User/UserInterface';

import AuthService from '../services/Auth/AuthService';
import APIError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';

export const signup = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any> | void> => {
    const authService = Container.get(AuthService);
    const userBody: UserInterface = req.body.user;

    const { user, token } = await authService.signup(userBody);

    authService.setJWTCookieToResponse(token, req, res);

    return res.status(201).json({
      status: 'success',
      message: 'User created successfully!',
      user,
      token,
    });
  }
);

export const signin = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any> | void> => {
    const authService = Container.get(AuthService);
    const { email, password } = req.body || {
      email: undefined,
      password: undefined,
    };

    if (!email || !password) {
      return next(new APIError(400, 'Please provide an email and password'));
    }

    const { user, token } = await authService.signin(email, password);

    authService.setJWTCookieToResponse(token, req, res);

    return res.status(200).json({
      status: 'success',
      message: 'User signed in successfully!',
      user,
      token,
    });
  }
);

export const logout = (
  req: Request,
  res: Response,
  next: NextFunction
): Response<any> | void => {
  try {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({ status: 'success' });
  } catch (error) {
    next(new APIError(400, `Error while logging out: ${error.message}`));
  }
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith('Bearer')) {
      token = token.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else {
      next(
        new APIError(401, 'You are not logged in. Please log in to get access.')
      );
    }

    const authService = Container.get(AuthService);
    const decodedToken = await authService.decodeToken(token);

    // Check if user still exists
    const user = await User.findById(decodedToken._id).exec();
    if (!user) {
      next(
        new APIError(401, 'The user belonging to this token no longer exists.')
      );
    }

    // Check if user changed password after the token was issued
    if (user.changedPasswordAfter(decodedToken.iat)) {
      next(
        new APIError(
          401,
          'The user recently changed its password! Please log in again.'
        )
      );
    }

    // req.user = user
    next();
  } catch (error) {
    next(error);
  }
};

export const restrictTo = catchAsync(() => {
  // When roles are implemented, receive an array of roles and restrict the access to them 
});

export const forgotPassword = catchAsync(() => {});

export const resetPassword = catchAsync(() => {});
export const updatePassword = catchAsync(() => {});
