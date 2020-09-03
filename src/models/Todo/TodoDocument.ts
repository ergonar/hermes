import mongoose from 'mongoose';

interface TodoDocument extends mongoose.Document {
  title: string;
  description: string;
}

export default TodoDocument;
