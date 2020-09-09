import mongoose from 'mongoose';

import PostDocument from './PostDocument';
import PostInterface from './PostInterface';

interface PostModel extends mongoose.Model<PostDocument> {
  build(attr: PostInterface): PostDocument;
}

export default PostModel;
