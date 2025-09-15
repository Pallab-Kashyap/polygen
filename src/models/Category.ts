import { Schema, model, models } from "mongoose";
import { CategoryType } from "@/types/category";

const CategorySchema = new Schema<CategoryType>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
    parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: true }
);

export default models?.Category ||
  model<CategoryType>("Category", CategorySchema);
