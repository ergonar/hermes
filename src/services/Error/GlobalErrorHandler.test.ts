import { Request, Response } from 'express';
import Container from 'typedi';
import httpMocks from 'node-mocks-http';

import config from '../../config';
import APIError from '../../utils/ApiError';
import GlobalErrorHandler from './GlobalErrorHandler';
import User from './../../models/User/user';
import {
  createCorrectUserMock,
  createUserMockWithIncorrectPasswords,
} from '../../../test/mock/userMock';
import { mongooseConnection as mongooseLoader } from './../../loaders/mongoose';

describe('Test Global Error Handler', () => {
  let globalErrorHandler: GlobalErrorHandler;

  beforeAll(() => {
    globalErrorHandler = Container.get(GlobalErrorHandler);
  });

  const createValidAPIReqAndRes = (): {
    request: httpMocks.MockRequest<Request>;
    response: httpMocks.MockResponse<Response>;
  } => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: `${config.api.prefix}/`,
    });
    const response = httpMocks.createResponse();

    return { request, response };
  };

  it('should get a dev error response when creating simple error with correct api url', () => {
    expect.assertions(6);
    const errorStatusCode = 400;
    const errorMessage = 'Something went wrong';

    const apiError = new APIError(errorStatusCode, errorMessage);
    const request = httpMocks.createRequest({
      method: 'GET',
      url: `${config.api.prefix}/`,
    });
    const response = httpMocks.createResponse();

    globalErrorHandler.sendErrorDev(apiError, request, response);
    const devErrorResponseData = response._getJSONData();

    expect(response.statusCode).toBe(400);
    expect(devErrorResponseData.error).toBeDefined();
    expect(devErrorResponseData.error.statusCode).toBe(errorStatusCode);
    expect(devErrorResponseData.message).toBe(errorMessage);
    expect(devErrorResponseData.stack).toBeDefined();
    expect(devErrorResponseData.status).toBe('fail');
  });

  it('should get a dev error response when giving incorrect api url', () => {
    expect.assertions(6);
    const errorStatusCode = 400;
    const errorMessage = 'Something went wrong';

    const apiError = new APIError(errorStatusCode, errorMessage);
    const request = httpMocks.createRequest({
      method: 'GET',
      url: `/incorrect/url`,
    });
    const response = httpMocks.createResponse();

    globalErrorHandler.sendErrorDev(apiError, request, response);
    const devErrorResponseData = response._getJSONData();

    expect(response.statusCode).toBe(404);
    expect(devErrorResponseData.error.statusCode).toBe(errorStatusCode); // Not Found
    expect(devErrorResponseData.message).not.toMatch(errorMessage);
    expect(devErrorResponseData.message).toBe('URL Not Found');
    expect(devErrorResponseData.stack).toBeDefined();
    expect(devErrorResponseData.status).toBe('fail');
  });

  it('should return an operational production error with correct api url', () => {
    expect.assertions(5);
    const errorStatusCode = 400;
    const errorMessage =
      'Something went wrong. We can show this error to the client';

    const apiError = new APIError(errorStatusCode, errorMessage);
    const request = httpMocks.createRequest({
      method: 'GET',
      url: `${config.api.prefix}/`,
    });
    const response = httpMocks.createResponse();

    globalErrorHandler.handleErrorProd(apiError, request, response);
    const prodErrorResponseData = response._getJSONData();

    expect(response.statusCode).toBe(errorStatusCode);
    expect(prodErrorResponseData.message).toBe(errorMessage);
    expect(prodErrorResponseData.status).toBe('fail');
    expect(prodErrorResponseData.error).not.toBeDefined();
    expect(prodErrorResponseData.stack).not.toBeDefined();
  });

  it('should not leak details about an unknown error with correct api url', () => {
    expect.assertions(5);
    const errorStatusCode = 400;
    const errorMessage =
      'Something broke in the system. The client must not see this error!';

    const apiError = new APIError(errorStatusCode, errorMessage, false); // Setting false for non operational error
    const request = httpMocks.createRequest({
      method: 'GET',
      url: `${config.api.prefix}/`,
    });
    const response = httpMocks.createResponse();

    globalErrorHandler.handleErrorProd(apiError, request, response);
    const prodErrorResponseData = response._getJSONData();

    expect(response.statusCode).toBe(500);
    expect(prodErrorResponseData.message).toBe('Something went wrong');
    expect(prodErrorResponseData.status).toBe('error');
    expect(prodErrorResponseData.error).not.toBeDefined();
    expect(prodErrorResponseData.stack).not.toBeDefined();
  });

  it('should send operational error with incorrect api url', () => {
    expect.assertions(5);
    const errorStatusCode = 400;
    const errorMessage =
      'Something broke in the system. The client must not see this error!';

    const apiError = new APIError(errorStatusCode, errorMessage);
    const request = httpMocks.createRequest({
      method: 'GET',
      url: `/incorrect/api`,
    });
    const response = httpMocks.createResponse();

    globalErrorHandler.handleErrorProd(apiError, request, response);
    const prodErrorResponseData = response._getJSONData();

    expect(response.statusCode).toBe(404);
    expect(prodErrorResponseData.message).toBe('URL Not Found');
    expect(prodErrorResponseData.status).toBe('fail');
    expect(prodErrorResponseData.error).toBeUndefined();
    expect(prodErrorResponseData.stack).toBeUndefined();
  });

  it('should handle Mongoose CastErrors', async () => {
    expect.assertions(5);
    const { request, response } = createValidAPIReqAndRes();

    try {
      const invalidId = 'invalidIdFormat';
      await User.findById(invalidId);
    } catch (error) {
      globalErrorHandler.handleErrorProd(error, request, response);
      const prodErrorResponseData = response._getJSONData();

      expect(response.statusCode).toBe(400);
      expect(prodErrorResponseData.message).toBe(
        `Invalid ${error.path}: ${error.value}.`
      );
      expect(prodErrorResponseData.status).toBe('fail');
      expect(prodErrorResponseData.error).toBeUndefined();
      expect(prodErrorResponseData.stack).toBeUndefined();
    }
  });

  describe('Mongoose operations', () => {
    let connection;

    beforeAll(async () => {
      connection = await mongooseLoader(config.mongoTestUrl);
    });

    afterEach(async () => {
      await User.deleteMany({});
    });

    afterAll(async () => {
      await connection.close();
    });

    it('should handle Mongoose ValidationError', async () => {
      expect.assertions(5);
      const { request, response } = createValidAPIReqAndRes();

      try {
        const userMock = createUserMockWithIncorrectPasswords();
        const user = User.build(userMock);
        await user.save();
      } catch (error) {
        globalErrorHandler.handleErrorProd(error, request, response);
        const prodErrorResponseData = response._getJSONData();

        expect(response.statusCode).toBe(400);
        expect(prodErrorResponseData.message).toMatch(`Invalid input data.`);
        expect(prodErrorResponseData.status).toBe('fail');
        expect(prodErrorResponseData.error).toBeUndefined();
        expect(prodErrorResponseData.stack).toBeUndefined();
      }
    });

    it('should handle Mongoose Duplicated Fields error code 11000', async () => {
      expect.assertions(5);
      const { request, response } = createValidAPIReqAndRes();

      try {
        const userMock = createCorrectUserMock();
        const firstUser = User.build(userMock);
        await firstUser.save();

        const secondUser = User.build(userMock);
        await secondUser.save();
      } catch (error) {
        globalErrorHandler.handleErrorProd(error, request, response);
        const prodErrorResponseData = response._getJSONData();

        expect(response.statusCode).toBe(400);
        expect(prodErrorResponseData.message).toMatch(`Duplicate field value:`);
        expect(prodErrorResponseData.status).toBe('fail');
        expect(prodErrorResponseData.error).toBeUndefined();
        expect(prodErrorResponseData.stack).toBeUndefined();
      }
    });
  });
});
