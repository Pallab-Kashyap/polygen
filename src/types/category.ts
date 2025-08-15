export interface CategoryType {
  _id?: string;
  slug: string;
  name: string;
  description?: string;
  parentId?: string
  createdAt?: Date;
  updatedAt?: Date;
  children?: CategoryType[];
}
