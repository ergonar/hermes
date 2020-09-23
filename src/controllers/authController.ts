import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
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
    const { email, password } = req.body.user || {
      email: undefined,
      password: undefined,
    };

    if (!email || !password) {
      return next(new APIError(400, 'Please provide an email and password'));
    }

    const { user, token } = await authService.signin(email, password);

    return res.status(200).json({
      status: 'success',
      message: 'User signed in successfully!',
      user,
      token,
    });
  }
);
