import { createCorrectUserMock } from './userMock';

import User from '../../src/models/User/user';
import Post from '../../src/models/Post/post';
import { createCorrectPostMock } from './postMock';
import {
  createCorrectParentPostCommentMock,
  createCorrectChildPostCommentMock,
} from './postCommentMock';
import PostComment from '../../src/models/PostComment/postComment';
import PostCommentDocument from '../../src/models/PostComment/PostCommentDocument';
import PostDocument from '../../src/models/Post/PostDocument';

export const createUser = async () => {
  const userMock = createCorrectUserMock();
  const user = User.build(userMock);
  return await user.save();
};

export const createPost = async () => {
  const user = await createUser();
  const postMock = createCorrectPostMock(user);
  const post = Post.build(postMock);
  return await post.save();
};

export const createParentCommentPost = async () => {
  const post = await createPost();
  const postCommentMock = createCorrectParentPostCommentMock(post);
  const postComment = PostComment.build(postCommentMock);
  return await postComment.save();
};

export const createChildCommentPost = async (
  parentCommentPost: PostCommentDocument
) => {
  const postCommentMock = createCorrectChildPostCommentMock(parentCommentPost);
  const postComment = PostComment.build(postCommentMock);
  return await postComment.save();
};
