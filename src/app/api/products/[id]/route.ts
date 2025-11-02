import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/controllers/product.controller";

export const dynamic = "force-dynamic";

export { getProductById as GET, updateProduct as PUT, deleteProduct as DELETE };
