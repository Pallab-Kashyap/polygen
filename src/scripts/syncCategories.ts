import dotenv from "dotenv";
import { connectDB } from "../lib/mongoose.js";
import mongoose from "mongoose";
import { CategoryType } from "../types/category.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: ".env.local" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CategorySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  { timestamps: true }
);

const Category =
  mongoose.models?.Category || mongoose.model("Category", CategorySchema);

const filterChildren = (categories: any[], parentId: string) =>
  categories.filter((cat) => String(cat.parentId) === String(parentId));

function buildHierarchy(categories: any[]): any[] {
  const newCatList: any[] = [];
  categories.forEach((cat) => {
    if (!cat.parentId) {
      cat.children = filterChildren(categories, String(cat._id));
      newCatList.push(cat);
    }
  });

  return newCatList;
}

async function syncCategories() {
  try {
    console.log("Connecting to database...");
    await connectDB();

    console.log("Fetching categories...");
    const categories = await Category.find().lean();

    console.log(`Found ${categories.length} categories`);
    const hierarchy = buildHierarchy(categories);

    const filePath = path.join(__dirname, "../data/categories.json");
    fs.writeFileSync(filePath, JSON.stringify(hierarchy, null, 2));

    console.log(
      `✅ Successfully synced ${hierarchy.length} top-level categories to ${filePath}`
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error syncing categories:", error);
    process.exit(1);
  }
}

syncCategories();
