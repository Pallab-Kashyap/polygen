import mongoose, { Document, Schema } from "mongoose";

export interface IBlog extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens",
      ],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    image: {
      type: String,
      trim: true,
    },
    readTime: {
      type: String,
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
BlogSchema.index({ isPublished: 1 });
BlogSchema.index({ createdAt: -1 });
BlogSchema.index({ tags: 1 });

export default mongoose.models.Blog ||
  mongoose.model<IBlog>("Blog", BlogSchema);
