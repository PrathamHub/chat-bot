import { randomUUID } from "crypto";
import mongoose, { Document, Types } from "mongoose";

// Define the Chat interface
interface IChat {
  id: string;
  role: string;
  content: string;
}

// Define the User interface extending the mongoose Document interface
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  chats: Types.DocumentArray<IChat>;
}

// Define the chat schema
const chatSchema = new mongoose.Schema<IChat>({
  id: {
    type: String,
    default: () => randomUUID(),
  },
  role: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

// Define the user schema
const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  chats: {
    type: [chatSchema],
    default: [], // Provide a default empty array if needed
  },
});

// Create the User model with the IUser interface
const User = mongoose.model<IUser>("User", userSchema);

export default User;
