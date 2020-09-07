import mongoose from 'mongoose';

import UserDocument from './UserDocument';
import UserInterface from './UserInterface';

interface UserModel extends mongoose.Model<UserDocument> {
  build(attr: UserInterface);
}

export default UserModel;
