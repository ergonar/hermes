import mongoose from 'mongoose';

interface PostCommentDocument extends mongoose.Document {
  post_id: string;
  child_comment_id: string;
  parent_comment_id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  updatedAt: Date;
  isEdited?: boolean;
}

export default PostCommentDocument;
