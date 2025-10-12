import { APIError, APIResponse } from "@/lib/ApiResponse";
import { asyncWrapper } from "@/lib/asyncWrapper";
import { errorHandler } from "@/lib/errorHandler";
import { connectDB } from "@/lib/mongoose";
import { requireAdminFromRequest } from "@/lib/requireAdmin";
import Product from "@/models/Product";
import { ProductType } from "@/types/product";
import { NextRequest } from "next/server";
import { z } from "zod";
import * as XLSX from "xlsx";

// Schema for a single product parameter
const ProductParameterSchema = z.object({
  label: z.string().min(1, "Parameter label cannot be empty"),
  values: z.array(z.string()).min(1, "Parameter must have at least one value"),
});

// Schema for a single bullet point in the description
const DescriptionBulletSchema = z.object({
  highlight: z.string().optional(),
  text: z.string().optional(),
});

// Schema for a block of description content
const ProductDescriptionBlockSchema = z.object({
  heading: z.string().optional(),
  bulletPoints: z.array(DescriptionBulletSchema).optional(),
  text: z.string().optional(),
});

// The main, updated Product Schema
export const ProductSchema = z.object({
  slug: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  about: z.string().optional(), // Updated to be optional
  categoryId: z.string().min(1, "Category is required"),

  // Updated to use the new nested schemas
  parameters: z.array(ProductParameterSchema).optional(),
  description: z.array(ProductDescriptionBlockSchema).optional(),

  // Unchanged fields
  applications: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  price: z.number().nullable().optional(),
  isTopSeller: z.boolean().optional(),
  metadata: z.record(z.any(), z.any()).optional(),
});

function formatProduct(doc: any): ProductType {
  return {
    _id: doc._id?.toString(),
    slug: doc.slug,
    name: doc.name,
    about: doc.about,
    categoryId: doc.categoryId ? doc.categoryId.toString() : "",
    parameters: doc.parameters ?? [],
    applications: doc.applications ?? [],
    description: doc.description ?? [],
    images: doc.images ?? [],
    price: typeof doc.price === "number" ? doc.price : null,
    isTopSeller: doc.isTopSeller ?? false,
    metadata: doc.metadata ?? {},
    createdAt: doc.createdAt
      ? new Date(doc.createdAt).toISOString()
      : undefined,
    updatedAt: doc.updatedAt
      ? new Date(doc.updatedAt).toISOString()
      : undefined,
  };
}

export const getAllProducts = asyncWrapper(async (req: NextRequest) => {
  await connectDB();
  const products = await Product.find();
  return APIResponse.success(products);
});

export const getTopSellerProducts = asyncWrapper(async (req: NextRequest) => {
  await connectDB();
  const products = await Product.find({ isTopSeller: true });
  return APIResponse.success(products);
});

export const getProductById = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    try {
      await connectDB();
    } catch (error) {
      throw APIError.internal("DB connection error");
    }

    const { id } = await params;

    const product = await Product.findById(id);

    if (!product) {
      throw APIError.badRequest("No product found");
    }

    return APIResponse.success(product);
  } catch (error) {
    return errorHandler(error);
  }
};

export const getProductsByCategory = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await connectDB();

    const { id } = await params;

    const products = await Product.find({ categoryId: id });

    if (!products) {
      throw APIError.notFound("No product found");
    }

    return APIResponse.success(products);
  } catch (error) {
    return errorHandler(error);
  }
};

export const getProductsByCategorySlug = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    try {
      await connectDB();
    } catch (error) {
      throw APIError.internal("DB connection failed");
    }

    const { slug } = await params;

    if (!slug) {
      throw APIError.badRequest("Category slug needed");
    }

    // First, find the category by slug
    const Category = await import("@/models/Category").then((m) => m.default);
    const category = await Category.findOne({ slug });

    if (!category) {
      throw APIError.notFound("Category not found");
    }

    // Get all subcategories recursively
    const getAllSubcategoryIds = async (
      parentId: string
    ): Promise<string[]> => {
      const subcategories = await Category.find({ parentId });
      let allIds = [parentId];

      for (const subcat of subcategories) {
        const subIds = await getAllSubcategoryIds(subcat._id.toString());
        allIds = allIds.concat(subIds);
      }

      return allIds;
    };

    const categoryIds = await getAllSubcategoryIds(category._id.toString());

    // Find products in this category and all its subcategories
    const products = await Product.find({
      categoryId: { $in: categoryIds },
    }).populate("categoryId");

    return APIResponse.success(products);
  } catch (error) {
    return errorHandler(error);
  }
};

export const createNewProduct = asyncWrapper(async (req: NextRequest) => {
  try {
    await requireAdminFromRequest(req);
    await connectDB();

    const body = await req.json();

    const parsed = ProductSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw APIError.badRequest(message);
    }

    const product = await Product.create(parsed.data);

    return APIResponse.created(product);
  } catch (error) {
    return errorHandler(error);
  }
});

export const bulkCreateProducts = async (req: NextRequest) => {
  try {
    await requireAdminFromRequest(req);
    await connectDB();

    // Get FormData from request
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      throw APIError.badRequest("No file uploaded");
    }

    // Validate file type
    const allowedTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw APIError.badRequest(
        "Invalid file type. Only CSV and Excel files are allowed."
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      throw APIError.badRequest("File size exceeds 5MB limit");
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Read and parse Excel/CSV
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const validProducts: any[] = [];
    const errors: any[] = [];

    sheetData.forEach((row: any, index: number) => {
      try {
        const productData: any = {};

        // Sanitize all string fields
        Object.keys(row).forEach((key) => {
          if (typeof row[key] === "string") {
            row[key] = row[key].trim();
          }
        });

        // Basic fields
        productData.slug = row.slug;
        productData.name = row.name;
        productData.about = row.about;
        productData.categoryId = row.categoryId || row.category;
        productData.price = row.price ? parseFloat(row.price) : null;
        productData.isTopSeller =
          row.isTopSeller === "true" ||
          row.isTopSeller === "1" ||
          row.isTopSeller === true;

        // Parse arrays from comma-separated strings
        if (row.applications && typeof row.applications === "string") {
          productData.applications = row.applications
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);
        }

        if (row.images && typeof row.images === "string") {
          productData.images = row.images
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);
        }

        // Parse Parameters (dynamic columns: Parameter Label N, Parameter Values N)
        const parameters: any[] = [];
        const parameterLabels = Object.keys(row).filter((key) =>
          key.match(/^Parameter Label \d+$/)
        );

        parameterLabels.forEach((labelKey) => {
          const num = labelKey.match(/\d+$/)?.[0];
          const valuesKey = `Parameter Values ${num}`;
          const label = row[labelKey];
          const valuesStr = row[valuesKey];

          if (label && valuesStr) {
            const values = valuesStr
              .split(",")
              .map((v: string) => v.trim())
              .filter(Boolean);
            if (values.length > 0) {
              parameters.push({ label, values });
            }
          }
        });

        if (parameters.length > 0) {
          productData.parameters = parameters;
        }

        // Parse Description Blocks (dynamic columns: Description Heading N, Bullet Highlight N.M, Bullet Text N.M, Description Text N)
        const description: any[] = [];
        const headingKeys = Object.keys(row)
          .filter((key) => key.match(/^Description Heading \d+$/))
          .sort();

        headingKeys.forEach((headingKey) => {
          const blockNum = headingKey.match(/\d+$/)?.[0];
          const block: any = {};

          const heading = row[headingKey];
          const descText = row[`Description Text ${blockNum}`];

          if (heading) block.heading = heading;
          if (descText) block.text = descText;

          // Find all bullet points for this block
          const bulletKeys = Object.keys(row)
            .filter((key) =>
              key.match(new RegExp(`^Bullet Highlight ${blockNum}\\.\\d+$`))
            )
            .sort();

          const bulletPoints: any[] = [];
          bulletKeys.forEach((highlightKey) => {
            const bulletNum = highlightKey.match(/\.(\d+)$/)?.[1];
            const textKey = `Bullet Text ${blockNum}.${bulletNum}`;

            const highlight = row[highlightKey];
            const text = row[textKey];

            if (highlight || text) {
              bulletPoints.push({
                ...(highlight && { highlight }),
                ...(text && { text }),
              });
            }
          });

          if (bulletPoints.length > 0) {
            block.bulletPoints = bulletPoints;
          }

          // Only add block if it has content
          if (Object.keys(block).length > 0) {
            description.push(block);
          }
        });

        if (description.length > 0) {
          productData.description = description;
        }

        // Parse Metadata (dynamic columns: Metadata Key N, Metadata Value N)
        const metadata: Record<string, any> = {};
        const metadataKeys = Object.keys(row)
          .filter((key) => key.match(/^Metadata Key \d+$/))
          .sort();

        metadataKeys.forEach((keyCol) => {
          const num = keyCol.match(/\d+$/)?.[0];
          const valueCol = `Metadata Value ${num}`;
          const key = row[keyCol];
          const value = row[valueCol];

          if (key && value !== undefined && value !== null && value !== "") {
            metadata[key] = value;
          }
        });

        if (Object.keys(metadata).length > 0) {
          productData.metadata = metadata;
        }

        // Generate slug if not provided
        if (!productData.slug && productData.name) {
          productData.slug = productData.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
        }

        const parseResult = ProductSchema.safeParse(productData);
        if (parseResult.success) {
          validProducts.push(parseResult.data);
        } else {
          errors.push({
            row: index + 2,
            issues: parseResult.error.issues.map((issue) => issue.message),
          });
        }
      } catch (error) {
        errors.push({
          row: index + 2,
          issues: [
            `Processing error: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          ],
        });
      }
    });

    if (validProducts.length > 0) {
      await Product.insertMany(validProducts, { ordered: false });
    }

    return APIResponse.success({
      inserted: validProducts.length,
      errors,
      totalProcessed: sheetData.length,
    });
  } catch (error) {
    return errorHandler(error);
  }
};

export const updateProduct = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await requireAdminFromRequest(req);
    await connectDB();

    const { id } = await params;

    const body = await req.json();
    const parsed = ProductSchema.partial().safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw APIError.badRequest(message);
    }

    await connectDB();
    const updated = await Product.findByIdAndUpdate(id, parsed.data, {
      new: true,
    });

    if (!updated) throw APIError.notFound("Product not found");
    return APIResponse.success(updated);
  } catch (error) {
    errorHandler(error);
  }
};

export const deleteProduct = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await requireAdminFromRequest(req);
    await connectDB();

    const { id } = await params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) throw APIError.notFound("Product not found");

    return APIResponse.success({ message: "Product deleted successfully" });
  } catch (error) {
    errorHandler(error);
  }
};

export const bulkDeleteProducts = asyncWrapper(async (req: NextRequest) => {
  await requireAdminFromRequest(req);
  await connectDB();

  const { ids } = await req.json();

  if (!Array.isArray(ids) || ids.length === 0) {
    throw APIError.badRequest("Product IDs array is required");
  }

  const result = await Product.deleteMany({ _id: { $in: ids } });

  return APIResponse.success(
    { deletedCount: result.deletedCount },
    `${result.deletedCount} product(s) deleted successfully`
  );
});
