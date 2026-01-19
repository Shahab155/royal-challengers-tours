// app/admin/categories/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowBack, MdAdd, MdUpload } from "react-icons/md";

export default function CreateCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [type, setType] = useState("both");
  const [status, setStatus] = useState("active");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (file) => {
    setImage(file);

    if (!file) {
      setImagePreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("type", type);
      formData.append("status", status);

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch("/api/admin/categories", {
        method: "POST",
        body: formData,
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

        {/* Error */}
        {error && (
          <div className="bg-red-50/80 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-2xl backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Form */}
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

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Adventure Tours"
                className="w-full px-5 py-4 text-lg rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            {/* Service Image */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Service Image
              </label>

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Service Preview"
                  className="h-48 w-full object-cover rounded-2xl border"
                />
              )}

              <label className="flex items-center gap-3 cursor-pointer text-indigo-600 dark:text-indigo-400 font-medium">
                <MdUpload size={22} />
                Upload image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleImageChange(e.target.files?.[0] || null)
                  }
                />
              </label>

              <p className="text-xs text-gray-500">
                JPG, PNG or WebP • Recommended size 800×600
              </p>
            </div>

            {/* Applies To */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Applies To
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
            <div className="pt-8 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
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
