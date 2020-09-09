import faker from 'faker';
import PostInterface from '../../src/models/Post/PostInterface';
import UserDocument from '../../src/models/User/UserDocument';

export const createCorrectPostMock = (user: UserDocument): PostInterface => {
  return {
    user_id: user._id,
    title: faker.lorem.words(),
    content: faker.lorem.paragraphs(),
    upvotes: faker.random.number(),
    downvotes: faker.random.number(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.future(),
  };
};

export const createPostMockWithRandomUUID = (): PostInterface => {
  return {
    user_id: faker.random.uuid(),
    title: faker.lorem.words(),
    content: faker.lorem.paragraphs(),
    upvotes: faker.random.number(),
    downvotes: -faker.random.number(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.future(),
  };
};
