import { productCategories } from "@/app/data/products";
import { connectDB } from "@/lib/mongoose";
import Category from "@/models/Category";
import { CategoryType } from "@/types/category";

export const main = async () => {
  await connectDB();

  for (const cat of productCategories) {

    const category = await insertDB({ name: cat.title, slug: cat.slug }, false);

    if (category) {
      const childData = cat.items.map((childCat) => ({
        ...childCat,
        parentId: category._id,
      }));

      await insertDB(childData, true);
    }
  }

};

const insertDB = async (
  data: any,
  many: boolean
): Promise<CategoryType | null> => {
  if (many) {
    await Category.insertMany(data);
    return null;
  }
  return await Category.create(data);
}
