"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddTourPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/tours", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      router.push("/admin/tours");
    } else {
      alert("Failed to create tour. Please try again.");
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text">Add New Tour</h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-text-secondary hover:text-text transition-colors"
        >
          ← Back
        </button>
      </div>

      {loading ? (
        <div className="card p-8 text-center text-text-secondary animate-pulse">
          Loading categories...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card p-8 shadow-lg space-y-6">
          {/* Basic Info */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-text-secondary">
              Tour Title <span className="text-accent-600">*</span>
            </label>
            <input
              id="title"
              name="title"
              placeholder="e.g. Discover the Northern Lights in Iceland"
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-text-secondary">
              Category <span className="text-accent-600">*</span>
            </label>
            <select
              id="category"
              name="category_id"
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="short" className="block text-sm font-medium text-text-secondary">
                Short Description
              </label>
              <textarea
                id="short"
                name="short_description"
                placeholder="Brief overview (shown in listings)"
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="desc" className="block text-sm font-medium text-text-secondary">
                Full Description
              </label>
              <textarea
                id="desc"
                name="description"
                placeholder="Detailed tour information, itinerary, inclusions..."
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-y"
              />
            </div>
          </div>

          {/* Pricing, Duration, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-text-secondary">
                Price (USD) <span className="text-accent-600">*</span>
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="days" className="block text-sm font-medium text-text-secondary">
                Duration (days) <span className="text-accent-600">*</span>
              </label>
              <input
                id="days"
                name="duration_days"
                type="number"
                min="1"
                placeholder="e.g. 7"
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-medium text-text-secondary">
                Initial Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue="active"
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive (draft)</option>
              </select>
            </div>
          </div>

          {/* Image Upload + Preview */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="image" className="block text-sm font-medium text-text-secondary">
                Tour Image <span className="text-accent-600">*</span>
              </label>
              <input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                required
                onChange={handleImageChange}
                className="block w-full text-sm text-text-secondary file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-100 file:text-primary-800 hover:file:bg-primary-200 file:transition-all file:cursor-pointer"
              />
            </div>

            {imagePreview && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-text-secondary">Preview:</p>
                <img
                  src={imagePreview}
                  alt="Tour preview"
                  className="h-48 w-full max-w-md object-cover rounded-xl shadow-md ring-1 ring-border"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-border flex justify-end">
            <button type="submit" className="btn-primary px-8 py-3 text-base font-semibold">
              Create Tour
            </button>
          </div>
        </form>
      )}
    </div>
  );
}