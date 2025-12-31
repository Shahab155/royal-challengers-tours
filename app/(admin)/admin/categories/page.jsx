// app/admin/categories/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MdAdd, MdDelete, MdEdit, MdRefresh } from "react-icons/md";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?\n\nThis action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete category. It may be in use.");
      }

      // Optimistic update
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete category");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950 p-6 md:p-8 lg:p-10">
      <div className="max-w-full mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Categories Management
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
              Organize and manage your travel package categories
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchCategories}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all disabled:opacity-50"
            >
              <MdRefresh size={18} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <Link
              href="/admin/categories/create"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <MdAdd size={22} />
              Add New Category
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50/80 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-2xl backdrop-blur-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6" />
            <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
              Loading categories...
            </p>
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-16 text-center space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              No categories yet
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Start organizing your travel packages by creating your first category.
            </p>
            <Link
              href="/admin/categories/create"
              className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              + Create First Category
            </Link>
          </div>
        ) : (
          <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm">
                <thead className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/40 dark:to-purple-950/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10">
                  <tr className="text-gray-700 dark:text-gray-300 font-semibold text-left">
                    <th className="px-6 py-5">Name</th>
                    <th className="px-6 py-5">Type</th>
                    <th className="px-6 py-5 text-center">Status</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                  {categories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="group hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-5 font-medium text-gray-900 dark:text-white truncate max-w-xs">
                        {cat.name}
                      </td>

                      <td className="px-6 py-5 capitalize text-gray-600 dark:text-gray-400">
                        {cat.type || "General"}
                      </td>

                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex px-4 py-1.5 text-xs font-semibold rounded-full ${
                            cat.status === "active"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700/50"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700/50"
                          }`}
                        >
                          {cat.status || "active"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right space-x-3">
                        <Link
                          href={`/admin/categories/edit/${cat.id}`}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all"
                        >
                          <MdEdit size={16} />
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/60 transition-all"
                        >
                          <MdDelete size={16} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}