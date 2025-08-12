
import { Schema, model, models } from "mongoose";
import { CategoryType } from "@/types/category";


const CategorySchema = new Schema<CategoryType>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
    parentId: { type: String, default: null}
  },
  { timestamps: true }
);

export default models.Category ||
  model<CategoryType>("Category", CategorySchema);
