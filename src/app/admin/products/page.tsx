"use client";
import { useState, useEffect, useCallback, useMemo, useContext } from "react";
import { Plus, Edit, Trash2, Upload, Search } from "lucide-react";
import { ProductType } from "@/types/product";
import { CategoryType } from "@/types/category";
import { useApi } from "@/hooks/useApi";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import Spinner from "@/components/shared/Spinner";
import Modal from "@/components/shared/Modal";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import ProductForm from "@/components/admin/ProductForm";
import FileUploadModal from "@/components/admin/FileUploadModal";
import { ToastContext } from "@/components/admin/AdminLayoutClient";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(
    null
  );
  const [deletingProduct, setDeletingProduct] = useState<ProductType | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const { setToast } = useContext(ToastContext);

  const { execute: fetchProducts, loading: fetchLoading } = useApi(
    productService.getAllProducts
  );
  const { execute: fetchCategories } = useApi(categoryService.getCategories);
  const { execute: saveProductApi, loading: saveLoading } = useApi(
    async (data: Partial<ProductType>) => {
      return editingProduct
        ? productService.updateProduct(editingProduct._id!, data)
        : productService.createProduct(data);
    }
  );
  const { execute: deleteProductApi, loading: deleteLoading } = useApi(
    productService.deleteProduct
  );
  const { execute: bulkUploadApi, loading: uploadLoading } = useApi(
    productService.bulkCreateProducts
  );

  const categoryMap = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat._id!] = cat.name;
      return acc;
    }, {} as Record<string, string>);
  }, [categories]);

  const loadData = useCallback(() => {
    fetchProducts()
      .then((data) => setProducts(data || []))
      .catch(() =>
        setToast({ message: "Failed to load products.", type: "error" })
      );
    fetchCategories()
      .then((data) =>
        setCategories(
          data?.flatMap((parent) => [parent, ...(parent.children ?? [])]) || []
        )
      )
      .catch(() =>
        setToast({ message: "Failed to load categories.", type: "error" })
      );
  }, [fetchProducts, fetchCategories, setToast]);

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (product: ProductType | null = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (data: Partial<ProductType>) => {
    try {
      await saveProductApi(data);
      setToast({
        message: `Product successfully ${
          editingProduct ? "updated" : "created"
        }!`,
        type: "success",
      });
      handleCloseModal();
      loadData();
    } catch (e: any) {
      setToast({
        message: `Error saving product: ${e.message}`,
        type: "error",
      });
    }
  };

  const handleDeleteClick = (product: ProductType) => {
    setDeletingProduct(product);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProductApi(deletingProduct._id!);
      setToast({ message: "Product deleted successfully!", type: "success" });
      setDeletingProduct(null);
      loadData();
    } catch (e: any) {
      setToast({
        message: `Error deleting product: ${e.message}`,
        type: "error",
      });
    }
  };

  const handleBulkUpload = async (formData: FormData) => {
    try {
      const result = await bulkUploadApi(formData);
      setToast({
        message: `${result} products uploaded successfully!`,
        type: "success",
      });
      setIsUploadModalOpen(false);
      loadData();
    } catch (e: any) {
      setToast({ message: `Upload failed: ${e.message}`, type: "error" });
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Products
        </h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition text-sm sm:text-base"
          >
            <Upload size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Bulk Upload</span>
            <span className="sm:hidden">Upload</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition text-sm sm:text-base"
          >
            <Plus size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      <div className="mb-4 relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {fetchLoading ? (
        <Spinner />
      ) : !filteredProducts ? (
        // categories is null/undefined — show error
        <div className="text-red-600">err</div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Mobile Card View */}
          <div className="block sm:hidden">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="border-b border-gray-200 p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 text-sm pr-2 flex-1">
                    {product.name}
                  </h3>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-medium">
                      {categoryMap[product.categoryId] || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-medium">
                      ${product.price?.toFixed(2) ?? "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Top Seller:</span>
                    <span
                      className={`font-medium text-xs ${
                        product.isTopSeller ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {product.isTopSeller ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Slug:</span>
                    <span className="font-medium text-xs break-all">
                      {product.slug}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Top Seller
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Slug
                  </th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {product.name}
                    </td>
                    <td className="px-6 py-4">
                      {categoryMap[product.categoryId] || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      ${product.price?.toFixed(2) ?? "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.isTopSeller
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.isTopSeller ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4">{product.slug}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? "Edit Product" : "Add New Product"}
      >
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={handleCloseModal}
          loading={saveLoading}
        />
      </Modal>

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleBulkUpload}
        loading={uploadLoading}
      />

      <ConfirmationModal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the product "${deletingProduct?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
