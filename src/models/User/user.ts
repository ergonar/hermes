import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

import UserInterface from './UserInterface';
import UserDocument from './UserDocument';
import UserModel from './UserModel';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'A Username is required'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'A Password is required'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirm your Password'],
    validate: {
      validator: function (passwordConfirm) {
        if (this.password) {
          return passwordConfirm === this.password;
        }
        return passwordConfirm === this.getUpdate().$set.password;
      },
      message: 'Passwords must match',
    },
    select: false,
  },
  email: {
    type: String,
    required: [true, 'An Email is Required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Provide a valid email'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.statics.build = (attr: UserInterface) => {
  return new User(attr);
};

userSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 8);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre<UserDocument>('save', function (next) {
  // Whenever the document is updated, set updatedAt to now.
  if (!this.isModified()) {
    return next();
  }

  this.updatedAt = new Date();
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export default User;
