// app/admin/categories/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowBack, MdAdd } from "react-icons/md";

export default function CreateCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [type, setType] = useState("both");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic client-side validation
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }
    if (name.trim().length < 3) {
      setError("Category name must be at least 3 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), type, status }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create category");
      }

      router.push("/admin/categories");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              Create New Category
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
              Organize your tours and packages with a new category
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Adventure Tours"
                  required
                  minLength={3}
                  className="w-full px-5 py-4 text-lg rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                {name.trim().length > 0 && name.trim().length < 3 && (
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
                value={type}
                onChange={(e) => setType(e.target.value)}
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
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
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
                disabled={loading}
                className="px-10 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center gap-3 px-10 py-4 text-xl font-bold text-white rounded-2xl shadow-xl transition-all duration-300 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-2xl hover:scale-105 active:scale-95"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <MdAdd size={22} />
                    Create Category
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