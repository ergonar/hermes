import mongoose from 'mongoose';

import PostDocument from './PostDocument';
import PostModel from './PostModel';
import PostInterface from './PostInterface';

import User from '../User/user';

const ValidationError = mongoose.Error.ValidationError;
const ValidatorError = mongoose.Error.ValidatorError;

const postSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User Id is Required'],
  },
  title: {
    type: String,
    required: [true, 'A Title is Required'],
  },
  content: {
    type: String,
    required: [true, 'Content is Required'],
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

postSchema.statics.build = (attr: PostInterface) => {
  return new Post(attr);
};

postSchema.pre<PostDocument>('save', function (next) {
  User.countDocuments({ _id: this.user_id }, (error, count) => {
    if (count === 0) {
      let validationError = new ValidationError(this);
      validationError.errors.user_id = new ValidatorError({
        message: 'User not found',
        reason:
          'Before saving a Post, the user is searched in Users, if the user does not exist a Validation Error is thrown.',
      });
      next(validationError);
    }
    next();
  });
});

const Post = mongoose.model<PostDocument, PostModel>('Post', postSchema);

export default Post;
