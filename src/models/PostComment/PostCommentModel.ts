import mongoose from 'mongoose';

import PostCommentDocument from './PostCommentDocument';
import PostCommentInterface from './PostCommentInterface';

interface PostCommentModel extends mongoose.Model<PostCommentDocument> {
  build(attr: PostCommentInterface): PostCommentDocument;
}

export default PostCommentModel;
