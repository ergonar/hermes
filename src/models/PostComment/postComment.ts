import mongoose from 'mongoose';

import PostCommentInterface from './PostCommentInterface';
import PostCommentDocument from './PostCommentDocument';
import PostCommentModel from './PostCommentModel';
import Post from '../Post/post';

const ValidationError = mongoose.Error.ValidationError;
const ValidatorError = mongoose.Error.ValidatorError;

const postCommentSchema = new mongoose.Schema({
  post_id: {
    type: String,
    ref: 'Post',
    required: [true, 'A Post Id is required'],
  },
  child_comment_id: {
    type: String,
    ref: 'PostComment',
    default: undefined,
  },
  parent_comment_id: {
    type: String,
    ref: 'PostComment',
    default: undefined,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
});

postCommentSchema.statics.build = (attr: PostCommentInterface) => {
  return new PostComment(attr);
};

//
//  Validator to check if the post exists
//
postCommentSchema.pre<PostCommentDocument>('save', function (next) {
  Post.countDocuments({ _id: this.post_id }, (error, count) => {
    if (count === 0) {
      let validationError = new ValidationError(this);
      validationError.errors.user_id = new ValidatorError({
        message: 'Post not found',
        reason:
          'Before saving a Post Comment, the Post is searched in Posts, if the post does not exist a Validation Error is thrown.',
      });
      next(validationError);
    }
    next();
  });
});

//
//  When appending a children comment, update the Parent's 'children_comment_id'
//
postCommentSchema.pre<PostCommentDocument>('save', function (next) {
  if (this.parent_comment_id === undefined) {
    return next();
  }

  PostComment.findOne(
    { _id: this.parent_comment_id },
    async (error, parentPostComment) => {
      if (parentPostComment === undefined || error) {
        next(
          new Error(
            'Error while creating a Child Post: Parent Post Comment not found'
          )
        );
      }

      parentPostComment.child_comment_id = this._id;
      await parentPostComment.save();
      next();
    }
  );
});

const PostComment = mongoose.model<PostCommentDocument, PostCommentModel>(
  'PostComment',
  postCommentSchema
);

export default PostComment;
