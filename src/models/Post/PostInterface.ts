interface PostInterface {
  user_id: string;
  title: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  updatedAt: Date;
  isEdited?: boolean;
}

export default PostInterface;
