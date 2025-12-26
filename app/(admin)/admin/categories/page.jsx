"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH CATEGORIES ================= */
  const fetchCategories = async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const confirmed = confirm(
      "Are you sure you want to delete this category?\n\nThis action cannot be undone."
    );

    if (!confirmed) return;

    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to delete category. It may be in use.");
      return;
    }

    // Refresh list
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) {
    return <p className="p-6">Loading categories...</p>;
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-text">
          Categories
        </h1>

        <Link
          href="/admin/categories/create"
          className="btn-primary whitespace-nowrap"
        >
          + Add New Category
        </Link>
      </div>

      {/* Table */}
      <div className="card shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-surface/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
              <tr className="text-text-secondary font-medium text-left">
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="space-y-4">
                      <p className="text-lg font-medium text-text">
                        No categories found
                      </p>
                      <Link
                        href="/admin/categories/create"
                        className="btn-primary inline-block px-6 py-2.5 text-sm"
                      >
                        + Create First Category
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-surface/60 transition-colors duration-150"
                  >
                    <td className="px-5 py-4 font-medium truncate max-w-xs">
                      {cat.name}
                    </td>

                    <td className="px-5 py-4 capitalize text-text-secondary">
                      {cat.type || "—"}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                          cat.status === "active"
                            ? "bg-primary-100 text-primary-800"
                            : "bg-accent-100 text-accent-800"
                        }`}
                      >
                        {cat.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right space-x-2">
                      <Link
                        href={`/admin/categories/edit/${cat.id}`}
                        className="btn-outline text-sm px-4 py-2"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg
                                   bg-red-600 text-white hover:bg-red-700
                                   transition-colors shadow-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
