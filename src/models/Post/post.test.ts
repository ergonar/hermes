import mongoose from 'mongoose';

import { mongooseConnection as mongooseLoader } from './../../loaders/mongoose';
import config from './../../config';

import {
  createCorrectPostMock,
  createPostMockWithRandomUUID,
} from '../../../test/mock/postMock';
import { createUser } from '../../../test/mock/modelsMock';

import Post from './post';
import User from './../User/user';

describe('Insert Posts', () => {
  let connection;

  beforeAll(async () => {
    connection = await mongooseLoader(config.mongoTestUrl);
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should create and save a Post successfully', async () => {
    expect.assertions(9);
    const user = await createUser();
    const mockPost = createCorrectPostMock(user);

    const post = Post.build(mockPost);
    await post.save();

    const savedPost = await Post.findOne({ title: mockPost.title });
    expect(savedPost._id).toBeDefined();
    expect(savedPost.user_id).toStrictEqual(mockPost.user_id);
    expect(savedPost.title).toBe(mockPost.title);
    expect(savedPost.content).toBe(mockPost.content);
    expect(savedPost.upvotes).toBe(mockPost.upvotes);
    expect(savedPost.downvotes).toBe(mockPost.downvotes);
    expect(savedPost.createdAt).toBeDefined();
    expect(savedPost.updatedAt).toBeDefined();
    expect(savedPost.isEdited).toBeFalsy();
  });

  it('should fail when given non existing user id', async () => {
    try {
      expect.assertions(1);
      const mockPost = createPostMockWithRandomUUID();

      const post = Post.build(mockPost);
      await post.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    }
  });
});
