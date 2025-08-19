import { APIError, APIResponse } from "@/lib/ApiResponse";
import { asyncWrapper } from "@/lib/asyncWrapper";
import { errorHandler } from "@/lib/errorHandler";
import { connectDB } from "@/lib/mongoose";
import { requireAdminFromRequest } from "@/lib/requireAdmin";
import Product from "@/models/Product";
import { ProductType } from "@/types/product";
import { NextRequest } from "next/server";
import { z } from "zod";
import formidable from "formidable";
import * as XLSX from "xlsx";
import { unlink } from "node:fs/promises";
import validator from "validator";

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
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();

    const id = params.id;

    const products = await Product.find({ categoryId: id });

    if (!products) {
      throw APIError.notFound("No product found");
    }

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

    const form = formidable({
      multiples: false,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024,
      filter: ({ mimetype }) =>
        mimetype === "text/csv" ||
        mimetype ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        mimetype === "application/vnd.ms-excel",
    });

    const { files }: any = await new Promise((resolve, reject) => {
      form.parse(req as any, (err, _fields, files) => {
        if (err) reject(err);
        else resolve({ files });
      });
    });

    if (!files.file) {
      throw APIError.badRequest("No valid file uploaded");
    }

    const filePath = files.file.filepath;

    // Read and parse Excel/CSV
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const validProducts: any[] = [];
    const errors: any[] = [];

    sheetData.forEach((row: any, index: number) => {
      // Optional: sanitize all string fields
      Object.keys(row).forEach((key) => {
        if (typeof row[key] === "string") {
          row[key] = validator.escape(row[key].trim());
        }
      });

      const parseResult = ProductSchema.safeParse(row);
      if (parseResult.success) {
        validProducts.push(parseResult.data);
      } else {
        errors.push({
          row: index + 2,
          issues: parseResult.error.issues,
        });
      }
    });

    if (validProducts.length > 0) {
      await Product.insertMany(validProducts, { ordered: false });
    }

    await unlink(filePath);

    return APIResponse.success({
      inserted: validProducts.length,
      errors,
    });
  } catch (error) {
    return errorHandler(error);
  }
};

export const updateProduct = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await requireAdminFromRequest(req);
    await connectDB();

    const body = await req.json();
    const parsed = ProductSchema.partial().safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw APIError.badRequest(message);
    }

    await connectDB();
    const updated = await Product.findByIdAndUpdate(params.id, parsed.data, {
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
  { params }: { params: { id: string } }
) => {
  try {
    await requireAdminFromRequest(req);
    await connectDB();

    const deleted = await Product.findByIdAndDelete(params.id);
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
