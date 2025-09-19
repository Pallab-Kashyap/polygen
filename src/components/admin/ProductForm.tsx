"use client";
import { useState, useEffect, useCallback } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { ProductDescriptionBlock, ProductType } from "@/types/product";
import { CategoryType } from "@/types/category";
import { useApi } from "@/hooks/useApi";
import { categoryService } from "@/services/categoryService";

interface ProductFormProps {
  product?: ProductType | null;
  onSave: (data: Partial<ProductType>) => void;
  onCancel: () => void;
  loading: boolean;
}

const ProductForm = ({
  product,
  onSave,
  onCancel,
  loading,
}: ProductFormProps) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [formData, setFormData] = useState<Partial<ProductType>>({
    name: "",
    slug: "",
    about: "",
    categoryId: "",
    price: null,
    isTopSeller: false,
    parameters: [],
    applications: [],
    description: [],
    images: [],
  });

  const { execute: fetchCategories } = useApi(categoryService.getCategories);

  const loadData = useCallback(() => {
    fetchCategories()
      .then((data) =>
        setCategories(
          data?.flatMap((parent) => [parent, ...(parent.children ?? [])]) || []
        )
      )
      .catch((err) => console.log(err));
  }, [fetchCategories]);

  useEffect(() => {
    loadData();
    if (product) {
      setFormData({
        name: product.name || "",
        slug: product.slug || "",
        about: product.about || "",
        categoryId: product.categoryId || "",
        price: product.price ?? null,
        isTopSeller: product.isTopSeller ?? false,
        parameters: product.parameters || [],
        applications: product.applications || [],
        description: product.description || [],
        images: product.images || [],
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        about: "",
        categoryId: "",
        price: null,
        isTopSeller: false,
        parameters: [],
        applications: [],
        description: [],
        images: [],
      });
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    let newSlug = formData.slug;
    if (name === "name" && !product) {
      newSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }

    // Handle checkbox input
    const inputValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
      slug: name === "name" ? newSlug : prev.slug,
    }));
  };

  const handleArrayChange = (
    field: "parameters" | "applications" | "images",
    index: number,
    subField: string | null,
    value: any
  ) => {
    const newArray = [...(formData[field] || [])];
    if (subField) {
      (newArray[index] as any)[subField] = value;
    } else {
      newArray[index] = value;
    }
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (
    field: "parameters" | "applications" | "images",
    newItem: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), newItem],
    }));
  };

  const removeArrayItem = (
    field: "parameters" | "applications" | "images",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));
  };

  // --- DESCRIPTION-SPECIFIC HANDLERS ---
  const handleDescriptionChange = (
    blockIndex: number,
    field: "heading" | "text",
    value: string
  ) => {
    const newDescription = [...(formData.description || [])];
    newDescription[blockIndex] = {
      ...newDescription[blockIndex],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, description: newDescription }));
  };

  const addDescriptionBlock = () => {
    const newBlock: ProductDescriptionBlock = {
      heading: "",
      text: "",
      bulletPoints: [],
    };
    setFormData((prev) => ({
      ...prev,
      description: [...(prev.description || []), newBlock],
    }));
  };

  const removeDescriptionBlock = (blockIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      description: (prev.description || []).filter((_, i) => i !== blockIndex),
    }));
  };

  const handleBulletPointChange = (
    blockIndex: number,
    pointIndex: number,
    field: "highlight" | "text",
    value: string
  ) => {
    const newDescription = [...(formData.description || [])];
    const newBulletPoints = [
      ...(newDescription[blockIndex].bulletPoints || []),
    ];
    newBulletPoints[pointIndex] = {
      ...newBulletPoints[pointIndex],
      [field]: value,
    };
    newDescription[blockIndex].bulletPoints = newBulletPoints;
    setFormData((prev) => ({ ...prev, description: newDescription }));
  };

  const addBulletPoint = (blockIndex: number) => {
    const newDescription = [...(formData.description || [])];
    const newBulletPoints = [
      ...(newDescription[blockIndex].bulletPoints || []),
      { highlight: "", text: "" },
    ];
    newDescription[blockIndex].bulletPoints = newBulletPoints;
    setFormData((prev) => ({ ...prev, description: newDescription }));
  };

  const removeBulletPoint = (blockIndex: number, pointIndex: number) => {
    const newDescription = [...(formData.description || [])];
    newDescription[blockIndex].bulletPoints = (
      newDescription[blockIndex].bulletPoints || []
    ).filter((_, i) => i !== pointIndex);
    setFormData((prev) => ({ ...prev, description: newDescription }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      // price: formData.price === '' || formData.price === null ? null : Number(formData.price),
      price: formData.price,
    };
    onSave(dataToSave);
  };

  // --- STYLES ---
  const inputStyle = "mt-1 p-1 pl-2 w-full rounded-md border-2 border-gray-400";
  const labelStyle = "font-medium text-gray-900";
  const sectionContainerStyle =
    "space-y-4 p-4 border rounded-lg bg-white shadow-sm";
  const buttonStyle =
    "flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-black">
      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className={labelStyle}>
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={inputStyle}
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className={labelStyle}>
            Slug
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className={inputStyle}
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="categoryId" className={labelStyle}>
            Category
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className={inputStyle}
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.parentId ? "\u00A0\u00A0" : ""}
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className={labelStyle}>
            Price
          </label>
          <input
            type="number"
            name="price"
            value={formData.price ?? ""}
            onChange={handleChange}
            placeholder="e.g., 29.99"
            step="0.01"
            className={inputStyle}
          />
        </div>

        {/* Top Seller Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isTopSeller"
            id="isTopSeller"
            checked={formData.isTopSeller ?? false}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isTopSeller" className={`ml-2 ${labelStyle}`}>
            Mark as Top Seller
          </label>
        </div>
      </div>

      {/* About Product */}
      <div>
        <label htmlFor="about" className={labelStyle}>
          About Product
        </label>
        <textarea
          name="about"
          value={formData.about}
          onChange={handleChange}
          rows={4}
          className={inputStyle}
        ></textarea>
      </div>

      {/* Dynamic Fields: Image URLs */}
      <div className="space-y-2 p-4 border rounded-lg">
        <h4 className="font-medium text-gray-800">Image URLs</h4>
        {formData.images?.map((app, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 bg-gray-50 rounded"
          >
            <input
              type="text"
              placeholder="https://example.com/image"
              value={app}
              onChange={(e) =>
                handleArrayChange("images", index, null, e.target.value)
              }
              className={`flex-1 ${inputStyle}`}
            />
            <button
              type="button"
              onClick={() => removeArrayItem("images", index)}
              className="p-2 text-red-500 hover:bg-red-100 rounded-full"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem("images", "")}
          className="flex items-center gap-1 text-sm text-indigo-600 hover:underline font-semibold mt-2"
        >
          <Plus size={16} />
          Add Image
        </button>
      </div>

      {/* Dynamic Fields: Parameters */}
      <div className="space-y-2 p-4 border rounded-lg">
        <h4 className="font-medium text-gray-800">Parameters</h4>
        {formData.parameters?.map((param, index) => (
          <div
            key={index}
            className="md:flex items-center gap-2 p-2 bg-gray-50 rounded"
          >
            <input
              type="text"
              placeholder="Label (e.g., Color)"
              value={param.label}
              onChange={(e) =>
                handleArrayChange("parameters", index, "label", e.target.value)
              }
              className={`flex-1 ${inputStyle}`}
            />
            <input
              type="text"
              placeholder="Values (comma separated)"
              value={param.values.join(",")}
              onChange={(e) =>
                handleArrayChange(
                  "parameters",
                  index,
                  "values",
                  e.target.value.split(",")
                )
              }
              className={`flex-1 ${inputStyle}`}
            />
            <button
              type="button"
              onClick={() => removeArrayItem("parameters", index)}
              className="p-2 text-red-500 hover:bg-red-100 rounded-full"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem("parameters", { label: "", values: [] })}
          className="flex items-center gap-1 text-sm text-indigo-600 hover:underline font-semibold mt-2"
        >
          <Plus size={16} />
          Add Parameter
        </button>
      </div>

      {/* Dynamic Fields: Applications */}
      <div className="space-y-2 p-4 border rounded-lg">
        <h4 className="font-medium text-gray-800">Applications</h4>
        {formData.applications?.map((app, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 bg-gray-50 rounded"
          >
            <input
              type="text"
              placeholder="Application"
              value={app}
              onChange={(e) =>
                handleArrayChange("applications", index, null, e.target.value)
              }
              className={`flex-1 ${inputStyle}`}
            />
            <button
              type="button"
              onClick={() => removeArrayItem("applications", index)}
              className="p-2 text-red-500 hover:bg-red-100 rounded-full"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem("applications", "")}
          className="flex items-center gap-1 text-sm text-indigo-600 hover:underline font-semibold mt-2"
        >
          <Plus size={16} />
          Add Application
        </button>
      </div>

      {/* Desciptions */}
      <div className={sectionContainerStyle}>
        <h3 className="text-lg font-semibold text-gray-900">
          Detailed Description
        </h3>
        {formData.description?.map((block, blockIndex) => (
          <div
            key={blockIndex}
            className="p-4 border rounded-md bg-gray-50 space-y-4 relative"
          >
            <div className={`${inputStyle} flex`}>
              <input
                type="text"
                placeholder="Section Heading (Optional)"
                value={block.heading}
                onChange={(e) =>
                  handleDescriptionChange(blockIndex, "heading", e.target.value)
                }
                className="flex-1 appearance-none outline-0"
              />
              <button
                type="button"
                onClick={() => removeDescriptionBlock(blockIndex)}
                className=" right-2 p-1.5 text-red-500 hover:bg-red-100 rounded-full transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <textarea
              placeholder="Section Text / Paragraph"
              value={block.text}
              onChange={(e) =>
                handleDescriptionChange(blockIndex, "text", e.target.value)
              }
              rows={4}
              className={inputStyle}
            ></textarea>

            <div className="pl-4 border-l-2 border-indigo-200 space-y-2">
              <h5 className="font-medium text-sm text-gray-600">
                Bullet Points
              </h5>
              {block.bulletPoints?.map((point, pointIndex) => (
                <div key={pointIndex} className="md:flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Highlight (e.g., Feature:)"
                    value={point.highlight}
                    onChange={(e) =>
                      handleBulletPointChange(
                        blockIndex,
                        pointIndex,
                        "highlight",
                        e.target.value
                      )
                    }
                    className={`${inputStyle} w-1/3`}
                  />
                  <input
                    type="text"
                    placeholder="Text (e.g., High-quality material)"
                    value={point.text}
                    onChange={(e) =>
                      handleBulletPointChange(
                        blockIndex,
                        pointIndex,
                        "text",
                        e.target.value
                      )
                    }
                    className={`${inputStyle} w-2/3`}
                  />
                  <button
                    type="button"
                    onClick={() => removeBulletPoint(blockIndex, pointIndex)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-full shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addBulletPoint(blockIndex)}
                className="text-sm text-indigo-600 hover:underline font-medium"
              >
                Add Bullet Point
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addDescriptionBlock}
          className="flex items-center gap-1 text-sm text-indigo-600 hover:underline font-semibold mt-2"
        >
          <Plus size={16} />
          Add Description Block
        </button>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-blue-400"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Product
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
