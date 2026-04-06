import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  userId: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  isAvailableNextWeek: boolean;
}
  

const userSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user", required: true },
    isAvailableNextWeek: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
