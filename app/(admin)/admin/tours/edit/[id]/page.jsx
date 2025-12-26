"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditTourPage() {
  const { id } = useParams();
  const router = useRouter();

  const [tour, setTour] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch(`/api/admin/tours/${id}`).then((r) => r.json()),
    ])
      .then(([cats, tourData]) => {
        setCategories(cats);
        setTour(tourData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const res = await fetch(`/api/admin/tours/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      router.push("/admin/tours");
    } else {
      alert("Failed to update tour");
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-text-secondary animate-pulse">Loading tour data...</div>
      </div>
    );
  }

  if (!tour) return null;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text">Edit Tour</h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-text-secondary hover:text-text transition-colors"
        >
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 card p-8 shadow-lg">
        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-text-secondary">
            Tour Title
          </label>
          <input
            id="title"
            name="title"
            defaultValue={tour.title}
            required
            className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium text-text-secondary">
            Category
          </label>
          <select
            id="category"
            name="category_id"
            defaultValue={tour.category_id}
            required
            className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Short & Full Description */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="short" className="block text-sm font-medium text-text-secondary">
              Short Description
            </label>
            <textarea
              id="short"
              name="short_description"
              defaultValue={tour.short_description}
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
              defaultValue={tour.description}
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-y"
            />
          </div>
        </div>

        {/* Numbers & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium text-text-secondary">
              Price (USD)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              defaultValue={tour.price}
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="days" className="block text-sm font-medium text-text-secondary">
              Duration (days)
            </label>
            <input
              id="days"
              name="duration_days"
              type="number"
              defaultValue={tour.duration_days}
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium text-text-secondary">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={tour.status}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Image */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-text-secondary">Current Image</label>
          {tour.image ? (
            <img
              src={`/images/tours/${tour.image}`}
              alt="Current tour"
              className="h-32 w-full max-w-xs object-cover rounded-xl shadow-md ring-1 ring-border"
            />
          ) : (
            <div className="h-32 w-full max-w-xs bg-surface flex items-center justify-center rounded-xl border border-border text-text-secondary">
              No image
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium text-text-secondary">
              Upload New Image (optional)
            </label>
            <input
              id="image"
              type="file"
              name="image"
              accept="image/*"
              className="block w-full text-sm text-text-secondary file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-100 file:text-primary-800 hover:file:bg-primary-200 file:transition-all file:cursor-pointer"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-border">
          <button type="submit" className="btn-primary px-8 py-3 text-base">
            Update Tour
          </button>
        </div>
      </form>
    </div>
  );
}