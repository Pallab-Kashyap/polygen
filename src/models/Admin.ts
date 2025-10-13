import mongoose, { Document, Model, Schema } from "mongoose";

export interface AdminDoc extends Document {
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<AdminDoc>(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export const Admin: Model<AdminDoc> =
  mongoose.models.Admin || mongoose.model<AdminDoc>("Admin", AdminSchema);
export default Admin;
