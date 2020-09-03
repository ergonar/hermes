import mongoose from 'mongoose';
import { Db } from 'mongodb';
import config from '../config';

const databaseUrl = config.databaseUrl.replace(
  '<PASSWORD>',
  config.databasePassword
);

export default async (): Promise<Db> => {
  try {
    const connection = await mongoose.connect(databaseUrl, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    return connection.connection.db;
  } catch (error) {
    console.log('Error while connecting to mongo database');
    throw new Error(error);
  }
};
