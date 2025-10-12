// Utility to sync categories to JSON file
import Category from "@/models/Category";
import { CategoryType } from "@/types/category";
import * as fs from "fs";
import * as path from "path";

const filterChildren = (categories: CategoryType[], parentId: string) =>
  categories.filter((cat) => String(cat.parentId) === String(parentId));

function buildHierarchy(categories: CategoryType[]): CategoryType[] {
  const newCatList: CategoryType[] = [];
  categories.forEach((cat) => {
    if (!cat.parentId) {
      cat.children = filterChildren(categories, String(cat._id));
      newCatList.push(cat);
    }
  });

  return newCatList;
}

export async function syncCategoriesToFile() {
  try {
    const categories = await Category.find().lean<CategoryType[]>();
    const hierarchy = buildHierarchy(categories);

    const filePath = path.join(process.cwd(), "src/data/categories.json");

    // Try to write the file - this will work in development and traditional deployments
    // On serverless (Vercel), this might fail due to read-only filesystem, but that's okay
    // because the cached JSON file is bundled with the deployment
    try {
      fs.writeFileSync(filePath, JSON.stringify(hierarchy, null, 2));
      console.log(`✅ Synced ${hierarchy.length} categories to file`);
    } catch (writeError) {
      // In production/serverless, file writes may fail - this is expected
      console.log(
        `ℹ️  File write skipped (read-only filesystem): ${writeError}`
      );
    }

    return true;
  } catch (error) {
    console.error("❌ Error syncing categories to file:", error);
    return false;
  }
}
