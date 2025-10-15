export interface BlogType {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image?: string;
  readTime?: string;
  isPublished: boolean;
  tags: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
