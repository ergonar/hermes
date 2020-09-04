import mongoose, { Mongoose } from 'mongoose';
import { Db } from 'mongodb';

import config from '../config';
import logger from './../utils/winston';

const databaseUrl = config.databaseUrl.replace(
  '<PASSWORD>',
  config.databasePassword
);

const connect = async (url: string): Promise<Mongoose> => {
  const connection = await mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  return connection;
};

export const mongooseDatabase = async (
  url: string = databaseUrl
): Promise<Db> => {
  try {
    const connection = await connect(url);
    return connection.connection.db;
  } catch (error) {
    logger.error('Error while connecting to mongo database');
    throw new Error(error);
  }
};

export const mongooseConnection = async (
  url: string = databaseUrl
): Promise<Mongoose> => {
  try {
    const connection = await connect(url);
    return connection;
  } catch (error) {
    logger.error('Error while connecting to mongo database');
    throw new Error(error);
  }
};
