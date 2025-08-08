import mongoose, { Schema, Document, Model, Types } from "mongoose";
import {
  DescriptionBullet as DescBulletType,
  ProductDescriptionBlock as DescBlockType,
} from "@/types/product";

export interface ProductDoc extends Document {
  slug: string;
  name: string;
  about?: string;
  categoryId?: Types.ObjectId | string;
  subCategoryId?: Types.ObjectId | string;
  parameters: { label: string; values: string[] }[];
  applications: string[];
  description: DescBlockType[];
  images: string[];
  price?: number | null;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const DescriptionBulletSchema = new Schema(
  {
    highlight: { type: String },
    text: { type: String },
  },
  { _id: false }
);

const DescriptionBlockSchema = new Schema(
  {
    heading: { type: String },
    bulletPoints: { type: [DescriptionBulletSchema], default: [] },
    text: { type: String },
  },
  { _id: false }
);

const ProductParameterSchema = new Schema(
  {
    label: { type: String, required: true },
    values: { type: [String], default: [] },
  },
  { _id: false }
);

const ProductSchema = new Schema<ProductDoc>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    about: { type: String },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category.subCategories",
    },
    parameters: { type: [ProductParameterSchema], default: [] },
    applications: { type: [String], default: [] },
    description: { type: [DescriptionBlockSchema], default: [] },
    images: { type: [String], default: [] },
    price: { type: Number, default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);


const Product: Model<ProductDoc> = mongoose.models.Product
  ? (mongoose.models.Product as Model<ProductDoc>)
  : mongoose.model<ProductDoc>("Product", ProductSchema);

export default Product;
