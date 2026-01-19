// app/admin/categories/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MdArrowBack, MdSave, MdUpload } from "react-icons/md";

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [imagePreview, setImagePreview] = useState(null);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/admin/categories/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Category not found");
        return res.json();
      })
      .then((data) => {
        setCategory(data);
        if (data.image) {
          setImagePreview(`/images/categories/${data.image}`);
        }
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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
      const formData = new FormData();
      formData.append("name", category.name.trim());
      formData.append("type", category.type);
      formData.append("status", category.status);

      if (newImage) {
        formData.append("image", newImage);
      }

      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        body: formData,
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

        {/* Error */}
        {error && (
          <div className="bg-red-50/80 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-2xl">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
        >
          <div className="p-8 lg:p-12 space-y-10">

            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                value={category.name}
                onChange={handleChange}
                className="w-full px-5 py-4 mt-2 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-900/50 text-gray-900 dark:text-white"
              />
            </div>

            {/* Image */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Service Image
              </label>

              {imagePreview && (
                <img
                  src={imagePreview}
                  className="w-full h-64 object-cover rounded-2xl shadow-lg"
                  alt="Preview"
                />
              )}

              <label className="flex items-center justify-center h-40 border-2 border-dashed rounded-2xl cursor-pointer hover:border-indigo-500 transition">
                <MdUpload size={40} className="text-indigo-500" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* Type */}
            <select
              name="type"
              value={category.type}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl border bg-white/70 dark:bg-gray-900/50"
            >
              <option value="both">Both</option>
              <option value="tour">Tours</option>
              <option value="package">Packages</option>
            </select>

            {/* Status */}
            <select
              name="status"
              value={category.status}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl border bg-white/70 dark:bg-gray-900/50"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={saving}
                className="px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold"
              >
                {saving ? "Updating..." : <><MdSave /> Update Category</>}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
