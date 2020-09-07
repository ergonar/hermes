import mongoose from 'mongoose';

interface UserDocument extends mongoose.Document {
  username: string;
  password: string;
  passwordConfirm: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
  active: boolean;
}

export default UserDocument;
