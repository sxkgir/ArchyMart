// src/components/UI/AddProductModal.tsx
import { useState } from "react";

export type CategoryName = "Sheet good" | "Single Each";

export type NewProductFormValues = {
  productName: string;
  categoryName: CategoryName;
  price: number;
  singleItem: boolean;
  availability: boolean;
  sqrFeet?: number;
  is3D: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: NewProductFormValues) => void;
};

const CATEGORY_OPTIONS: CategoryName[] = ["Sheet good", "Single Each"];

export default function AddProductModal({ isOpen, onClose, onSubmit }: Props) {
  // NOTE: local state allows "" so we can show the placeholder
  const [productName, setProductName] = useState("");
  const [categoryNameStr, setCategoryNameStr] = useState<"" | CategoryName>(""); // "" = Please select
  const [priceStr, setPriceStr] = useState("");
  const [sqrFeetStr, setSqrFeetStr] = useState("");
  const [singleItem, setSingleItem] = useState(false);
  const [availability, setAvailability] = useState(true);
  const [is3D, setIs3D] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const reset = () => {
    setProductName("");
    setCategoryNameStr("");
    setPriceStr("");
    setSqrFeetStr("");
    setSingleItem(false);
    setAvailability(true);
    setIs3D(false);
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!productName.trim()) {
      setError("Product name is required.");
      return;
    }
    if (categoryNameStr === "") {
      setError("Please select a category.");
      return;
    }

    const price = Number(priceStr);
    if (!Number.isFinite(price) || price < 0) {
      setError("Price must be a non-negative number.");
      return;
    }

    let sqrFeet: number | undefined = undefined;
    if (sqrFeetStr.trim() !== "") {
      const parsed = Number(sqrFeetStr);
      if (!Number.isFinite(parsed) || parsed < 0) {
        setError("Square feet must be a non-negative number.");
        return;
      }
      sqrFeet = parsed;
    }

    onSubmit({
      productName: productName.trim(),
      categoryName: categoryNameStr, // now guaranteed to be CategoryName
      price,
      singleItem,
      availability,
      sqrFeet,
      is3D,
    });

    reset();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]"
      aria-modal="true"
      role="dialog"
      aria-labelledby="add-product-title"
    >
      <div className="w-[min(640px,95vw)] rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 id="add-product-title" className="text-lg font-semibold">
            Add Product
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Product Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Product Name</label>
              <input
                className="mt-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>

            {/* Category Name (select with "Please select") */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Category Name</label>
              <select
                className={`mt-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 ${
                  categoryNameStr === "" ? "text-gray-400 focus:ring-blue-500" : "focus:ring-blue-500"
                }`}
                value={categoryNameStr}
                onChange={(e) => setCategoryNameStr(e.target.value as "" | CategoryName)}
                aria-invalid={categoryNameStr === "" ? "true" : "false"}
              >
                <option value="" disabled>
                  Please select
                </option>
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="mt-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={priceStr}
                onChange={(e) => setPriceStr(e.target.value)}
                required
              />
            </div>

            {/* Square Feet (optional) */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Square Feet</label>
              <input
                type="number"
                min="0"
                step="1"
                className="mt-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sqrFeetStr}
                onChange={(e) => setSqrFeetStr(e.target.value)}
                placeholder="optional"
              />
            </div>

            {/* Single Item */}
            <div className="flex items-center gap-2">
              <input
                id="singleItem"
                type="checkbox"
                checked={singleItem}
                onChange={(e) => setSingleItem(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="singleItem" className="text-sm text-gray-700">
                Single Item
              </label>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2">
              <input
                id="availability"
                type="checkbox"
                checked={availability}
                onChange={(e) => setAvailability(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="availability" className="text-sm text-gray-700">
                Available
              </label>
            </div>

            {/* is3D */}
            <div className="flex items-center gap-2">
              <input
                id="is3d"
                type="checkbox"
                checked={is3D}
                onChange={(e) => setIs3D(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="is3d" className="text-sm text-gray-700">
                is3D
              </label>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
