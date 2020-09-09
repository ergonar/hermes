import mongoose from 'mongoose';

import { mongooseConnection as mongooseLoader } from './../../loaders/mongoose';

import config from './../../config';

import Post from './../Post/post';
import PostComment from './postComment';
import User from './../User/user';
import {
  createPost,
  createChildCommentPost,
  createParentCommentPost,
} from '../../../test/mock/modelsMock';
import {
  createCorrectParentPostCommentMock,
  createCorrectChildPostCommentMock,
} from '../../../test/mock/postCommentMock';

describe('Insert Post Comments', () => {
  let connection;

  beforeAll(async () => {
    connection = await mongooseLoader(config.mongoTestUrl);
  });

  afterEach(async () => {
    await PostComment.deleteMany({});
    await Post.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  // Parent post comment or main comment on which other comments can be made.
  it('should create and save a Parent Post Comment successfully', async () => {
    expect.assertions(10);
    const post = await createPost();
    const postCommentMock = createCorrectParentPostCommentMock(post);
    const postComment = PostComment.build(postCommentMock);
    const savedPostComment = await postComment.save();

    expect(savedPostComment._id).toBeDefined();
    expect(savedPostComment.post_id).toStrictEqual(
      postCommentMock.post_id.toString()
    );
    expect(savedPostComment.child_comment_id).toBeUndefined();
    expect(savedPostComment.parent_comment_id).toBeUndefined();
    expect(savedPostComment.content).toBe(postCommentMock.content);
    expect(savedPostComment.upvotes).toBe(postCommentMock.upvotes);
    expect(savedPostComment.downvotes).toBe(postCommentMock.downvotes);
    expect(savedPostComment.createdAt).toBeDefined();
    expect(savedPostComment.updatedAt).toBeDefined();
    expect(savedPostComment.isEdited).toBeFalsy();
  });

  it('should create and save a Child Post Comment successfully', async () => {
    expect.assertions(10);
    const parentPostComment = await createParentCommentPost();
    const childPostCommentMock = createCorrectChildPostCommentMock(
      parentPostComment
    );
    const childPostComment = PostComment.build(childPostCommentMock);
    const savedChildPostComment = await childPostComment.save();

    expect(savedChildPostComment._id).toBeDefined();
    expect(savedChildPostComment.post_id).toStrictEqual(
      childPostCommentMock.post_id.toString()
    );
    expect(savedChildPostComment.child_comment_id).toBeUndefined();
    expect(savedChildPostComment.parent_comment_id).toStrictEqual(
      parentPostComment._id.toString()
    );
    expect(savedChildPostComment.content).toBe(childPostCommentMock.content);
    expect(savedChildPostComment.upvotes).toBe(childPostCommentMock.upvotes);
    expect(savedChildPostComment.downvotes).toBe(
      childPostCommentMock.downvotes
    );
    expect(savedChildPostComment.createdAt).toBeDefined();
    expect(savedChildPostComment.updatedAt).toBeDefined();
    expect(savedChildPostComment.isEdited).toBeFalsy();
  });

  it('should create and save a post comment with a children and a parent', () => {});
});
