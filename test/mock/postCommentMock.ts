import faker from 'faker';

import PostDocument from '../../src/models/Post/PostDocument';
import PostCommentInterface from '../../src/models/PostComment/PostCommentInterface';
import PostCommentDocument from '../../src/models/PostComment/PostCommentDocument';

export const createCorrectParentPostCommentMock = (
  post: PostDocument
): PostCommentInterface => {
  return {
    post_id: post._id,
    child_comment_id: undefined,
    parent_comment_id: undefined,
    content: faker.lorem.paragraph(),
    upvotes: faker.random.number(),
    downvotes: faker.random.number(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.future(),
  };
};

export const createCorrectChildPostCommentMock = (
  parentPostComment: PostCommentDocument
): PostCommentInterface => {
  return {
    post_id: parentPostComment.post_id,
    child_comment_id: undefined,
    parent_comment_id: parentPostComment._id,
    content: faker.lorem.paragraph(),
    upvotes: faker.random.number(),
    downvotes: faker.random.number(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.future(),
  };
};
