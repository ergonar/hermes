import mongoose from 'mongoose';

interface UserDocument extends mongoose.Document {
  username: string;
  password: string;
  passwordConfirm: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  passwordResetToken: string;
  passwordResetExpires: Date;
  active: boolean;

  correctPassword(candidatePassword: string, userPassword: string): boolean;
}

export default UserDocument;
