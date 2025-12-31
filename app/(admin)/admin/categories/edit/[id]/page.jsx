// app/admin/categories/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MdArrowBack, MdSave } from "react-icons/md";

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    fetch(`/api/admin/categories/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Category not found");
        return res.json();
      })
      .then((data) => {
        setCategory(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load category");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic client-side validation
    if (!category.name.trim()) {
      setError("Category name is required");
      return;
    }
    if (category.name.trim().length < 3) {
      setError("Category name must be at least 3 characters");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: category.name.trim(),
          type: category.type,
          status: category.status,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update category");
      }

      router.push("/admin/categories");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
            Loading category data...
          </p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950 p-6">
        <div className="bg-red-50/80 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 px-10 py-12 rounded-3xl shadow-2xl max-w-lg w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-lg mb-6">{error || "Category not found"}</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950 p-6 md:p-8 lg:p-10">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-purple-400 font-medium mb-4 transition-colors"
            >
              <MdArrowBack size={20} />
              Back to Categories
            </button>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Edit Category
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
              Update details for this travel category
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50/80 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-2xl backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
        >
          <div className="p-8 lg:p-12 space-y-10">
            {/* Category Name */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={category.name || ""}
                  onChange={handleChange}
                  placeholder="e.g. Adventure Tours"
                  required
                  minLength={3}
                  className="w-full px-5 py-4 text-lg rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                {category.name && category.name.trim().length < 3 && (
                  <p className="mt-1.5 text-sm text-rose-500">
                    Name must be at least 3 characters
                  </p>
                )}
              </div>
            </div>

            {/* Applies To */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Applies To <span className="text-rose-500">*</span>
              </label>
              <select
                name="type"
                value={category.type || "both"}
                onChange={handleChange}
                className="w-full px-5 py-4 text-lg rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all appearance-none"
              >
                <option value="both">Both (Tours & Packages)</option>
                <option value="tour">Tours Only</option>
                <option value="package">Packages Only</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Status
              </label>
              <select
                name="status"
                value={category.status || "active"}
                onChange={handleChange}
                className="w-full px-5 py-4 text-lg rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all appearance-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive (Draft)</option>
              </select>
            </div>

            {/* Actions */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push("/admin/categories")}
                disabled={saving}
                className="px-10 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className={`inline-flex items-center gap-3 px-10 py-4 text-xl font-bold text-white rounded-2xl shadow-xl transition-all duration-300 ${
                  saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-2xl hover:scale-105 active:scale-95"
                }`}
              >
                {saving ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <MdSave size={22} />
                    Update Category
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}