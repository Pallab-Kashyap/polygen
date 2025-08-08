// src/types/product.ts
export interface SubCategoryType {
  id?: string;
  slug: string;
  name: string;
  description?: string;
}

export interface CategoryType {
  id?: string;
  slug: string;
  name: string;
  description?: string;
  subCategories?: SubCategoryType[];
}

export interface ProductParameter {
  label: string;
  values: string[];
}

export interface DescriptionBullet {
  highlight?: string;
  text?: string;
}

export interface ProductDescriptionBlock {
  heading?: string;
  bulletPoints?: DescriptionBullet[];
  text?: string;
}

export interface ProductType {
  id?: string;
  slug: string;
  name: string;
  about?: string;
  categoryId: string;
  subCategoryId?: string;
  parameters?: ProductParameter[];
  applications?: string[];
  description?: ProductDescriptionBlock[];
  images?: string[];
  price?: number | null;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}
