// src/components/StaffProductsTable.tsx
import { useEffect, useMemo, useState } from "react";
import { useProductContext } from "../contexts/ProductProvider";
import type { Product } from "../Types/Product";
import AddProductModal, {type NewProductFormValues } from "../Components/UI/AddProductModal";
import MessageModal from "./UI/MessageModal";

type ProductsResponse = { products: Product[]; role: "staff" | "student" };

export default function StaffProductsTable() {
  const { getAllProducts,addProduct,deleteProducts, message} = useProductContext();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"staff" | "student" | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  // client-side pagination
  const [page, setPage] = useState(1);
  const limit = 12;

  // availability sort
  const [availabilitySort, setAvailabilitySort] = useState<"asc" | "desc">("asc");
  const toggleAvailabilitySort = () =>
    setAvailabilitySort((s) => (s === "asc" ? "desc" : "asc"));

  // Add Product modal
  const [isAddOpen, setIsAddOpen] = useState(false);

  //Delete
  const [pendingDelete, setPendingDelete] = useState<Set<number>>(new Set());

  const togglePendingDelete = (id: number) => {
    setPendingDelete((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleConfirmDelete = async () => {

    if (pendingDelete.size === 0) return;
    
    const ok = window.confirm(
      `Delete ${pendingDelete.size} selected product(s)? This cannot be undone.`
    );
    if (!ok) return;
    try{
      const ids = Array.from(pendingDelete);
      const resp = await deleteProducts(ids);
    }

    finally{
      setShowModal(true)
    }
    setProducts((prev) => {
      const updated = prev.filter((p) => !pendingDelete.has(Number(p.productID)));
      return updated;
    });

    setPendingDelete(new Set());

  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data: ProductsResponse | Product[] = await getAllProducts();
        const arr = Array.isArray(data) ? data : data?.products || [];
        const r = Array.isArray(data) ? undefined : data?.role;
        setProducts(arr);
        if (r) setRole(r);
      } catch (e: any) {
        setError(e?.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    })();
  }, [getAllProducts]);

  const sorted = useMemo(() => {
    const dir = availabilitySort === "asc" ? 1 : -1;
    const copy = [...products];
    copy.sort((a, b) => {
      const av = Number(!!a.availability);
      const bv = Number(!!b.availability);
      if (av === bv) return a.productName.localeCompare(b.productName);
      return dir * (av - bv);
    });
    return copy;
  }, [products, availabilitySort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / limit));
  const pageSafe = Math.min(page, totalPages);
  const slice = useMemo(() => {
    const start = (pageSafe - 1) * limit;
    return sorted.slice(start, start + limit);
  }, [sorted, pageSafe]);

  const handleOpenAdd = () => setIsAddOpen(true);
  const handleCloseAdd = () => setIsAddOpen(false);


  const handleAddSubmit = async(values: NewProductFormValues) => {
    try{
      const created = await addProduct({
        productName: values.productName,
        categoryName: values.categoryName,
        price: values.price,
        singleItem: values.singleItem,
        availability: values.availability,
        sqrFeet: values.sqrFeet,
        is3D: values.is3D,
      });
      setProducts((prev) => {
        const updated = [...prev, created];
        return updated
      });
    }

    finally {
      setShowModal(true)
    }

    handleCloseAdd();
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-600">
        Loading products…
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (role === "student") {
    return (
      <div className="text-center text-sm text-gray-600">
        You don't have permission to view this table.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      {showModal && <MessageModal message={message} onClose={() => closeModal()}/>}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Products (Staff View)</h2>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            Total: {sorted.length} • Page {pageSafe} of {totalPages}
          </div>

          {/* Delete Selected */}
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={pendingDelete.size === 0}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
              pendingDelete.size === 0
                ? "bg-red-200 text-white cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
            }`}
            title={
              pendingDelete.size === 0
                ? "No products selected"
                : `Delete ${pendingDelete.size} selected`
            }
          >
            Delete Selected ({pendingDelete.size})
          </button>

          {/* Add Product */}
          <button
            type="button"
            onClick={handleOpenAdd}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800"
          >
            + Add Product
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">Product ID</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Product Name</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Category Name</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Square Feet</th>
              <th
                className="px-4 py-3 font-semibold text-gray-700 select-none"
                aria-sort={availabilitySort === "asc" ? "ascending" : "descending"}
              >
                <button
                  type="button"
                  onClick={toggleAvailabilitySort}
                  className="inline-flex items-center gap-1 hover:text-gray-900"
                  title={
                    availabilitySort === "asc"
                      ? "Sorting: Unavailable ▲ first (click to switch to Available ▼ first)"
                      : "Sorting: Available ▼ first (click to switch to Unavailable ▲ first)"
                  }
                >
                  Availability
                  <span className="text-xs">
                    {availabilitySort === "asc" ? "▲" : "▼"}
                  </span>
                </button>
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">is3D</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Price</th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((p) => {
              const idNum = Number(p.productID);
              const marked = pendingDelete.has(idNum);

              return (
                <tr
                  key={p.productID}
                  className={`border-t ${marked ? "bg-red-50" : ""}`}
                >
                  <td className="px-4 py-3">{p.productID}</td>
                  <td className="px-4 py-3">{p.productName}</td>
                  <td className="px-4 py-3">{p.categoryName}</td>
                  <td className="px-4 py-3">{(p as any).sqrFeet ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.availability
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {p.availability ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        (p as any).is3D
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {(p as any).is3D ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">${p.price}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => togglePendingDelete(idNum)}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-white ${
                        marked
                          ? "bg-red-700 hover:bg-red-800"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                      title={marked ? "Unmark for deletion" : "Mark for deletion"}
                      aria-pressed={marked}
                    >
                      –
                    </button>
                  </td>
                </tr>
              );
            })}

            {slice.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No products.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          className="rounded-lg border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={pageSafe <= 1}
        >
          Prev
        </button>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }).map((_, i) => {
            const n = i + 1;
            const active = n === pageSafe;
            return (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`h-8 w-8 rounded-md text-sm ${
                  active
                    ? "bg-gray-900 text-white"
                    : "border bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>
        <button
          className="rounded-lg border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={pageSafe >= totalPages}
        >
          Next
        </button>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddOpen}
        onClose={handleCloseAdd}
        onSubmit={handleAddSubmit}
      />
    </div>
  );
}