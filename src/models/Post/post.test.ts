import mongoose from 'mongoose';

import { mongooseConnection as mongooseLoader } from './../../loaders/mongoose';

import config from './../../config';
import Post from './post';
import User from './../User/user';
import logger from '../../utils/winston';

describe('Insert Posts', () => {
  let connection;
  let database;

  beforeAll(async () => {
    connection = await mongooseLoader(config.mongoTestUrl);
    database = connection.connection.db;
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should create and save a Post successfully', async () => {
    expect.assertions(9);
    const user = await createUser();
    const mockPost = createMockPostData(user);

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
      const user = { _id: '5f56b416f3071cd5cbe364a4' };
      const mockPost = createMockPostData(user);

      const post = Post.build(mockPost);
      await post.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      console.log(error);
    }
  });

  const createUser = async () => {
    const user = User.build(userMock);
    return await user.save();
  };

  const userMock = {
    username: 'John Smith',
    password: 'somePassword',
    passwordConfirm: 'somePassword',
    email: 'john@email.com',
    passwordResetToken: 'passwordResetToken',
    passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000), // Ten days from now on
  };

  const createMockPostData = user => {
    return {
      user_id: user._id,
      title: 'Post title',
      content: 'Post content',
      upvotes: 20,
      downvotes: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };
});
