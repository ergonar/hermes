import expressLoader from './express';
import { mongooseDatabase as mongooseLoader } from './mongoose';

export default async ({ expressApp }) => {
  try {
    expressLoader({ app: expressApp });
    console.log('Express Initialized!');

    await mongooseLoader();
    console.log('Database loaded and connected!');
  } catch (error) {
    console.log(error);
  }
};
