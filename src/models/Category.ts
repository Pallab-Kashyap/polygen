
import mongoose, { Schema, model, models } from "mongoose";
import { CategoryType } from "@/types/category";

const SubCatSchema = new Schema<CategoryType["subCategories"][number]>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
  },
  { _id: true }
);

// Create main category schema
const CategorySchema = new Schema<CategoryType>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
    subCategories: [SubCatSchema],
  },
  { timestamps: true }
);

export default models.Category ||
  model<CategoryType>("Category", CategorySchema);
