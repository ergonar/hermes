import expressLoader from './express';

export default ({ expressApp }) => {
  expressLoader({ app: expressApp });
  console.log('Express Initialized');
};
