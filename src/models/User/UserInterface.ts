interface UserInterface {
  _id?: string;
  username: string;
  password: string;
  passwordConfirm: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
  passwordUpdatedAt?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  active?: boolean;
  role?: string;
}

export default UserInterface;
