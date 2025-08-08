import { Types } from "mongoose";

export interface SubCategoryType {
  _id?: Types.ObjectId;
  slug: string;
  name: string;
  description?: string;
}

export interface CategoryType {
  _id?: Types.ObjectId;
  slug: string;
  name: string;
  description?: string;
  subCategories: SubCategoryType[];
  createdAt?: Date;
  updatedAt?: Date;
}
