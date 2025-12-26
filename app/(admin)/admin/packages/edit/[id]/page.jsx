"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditPackagePage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    title: "",
    category_id: "",
    short_description: "",
    description: "",
    price: "",
    duration_days: "",
    status: "active",
  });

  const [existingImage, setExistingImage] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch categories
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setError("Failed to load categories"));
  }, []);

  // Fetch package data
  useEffect(() => {
    if (!id) return;

    fetch(`/api/admin/packages/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Package not found");
        return res.json();
      })
      .then((data) => {
        setForm({
          title: data.title || "",
          category_id: String(data.category_id || ""),
          short_description: data.short_description || "",
          description: data.description || "",
          price: data.price || "",
          duration_days: data.duration_days || "",
          status: data.status || "active",
        });

        setExistingImage(data.image);
        setImagePreview(data.image ? `/images/packages/${data.image}` : null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load package");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setNewImageFile(null);
      setImagePreview(existingImage ? `/images/packages/${existingImage}` : null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (newImageFile) formData.append("image", newImageFile);

    try {
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update package");

      router.push("/admin/packages");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-text-secondary animate-pulse">Loading package data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text">Edit Package</h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-text-secondary hover:text-text transition-colors"
        >
          ← Back
        </button>
      </div>

      {error && (
        <div className="bg-accent-100/50 border border-accent-300 text-accent-800 p-4 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-8 shadow-lg space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-text-secondary">
            Package Title <span className="text-accent-600">*</span>
          </label>
          <input
            id="title"
            name="title"
            required
            value={form.title}
            onChange={handleChange}
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
            value={form.category_id}
            onChange={handleChange}
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
              rows={3}
              value={form.short_description}
              onChange={handleChange}
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
              rows={6}
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-y"
            />
          </div>
        </div>

        {/* Price & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium text-text-secondary">
              Price (USD) <span className="text-accent-600">*</span>
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              name="price"
              required
              value={form.price}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="duration" className="block text-sm font-medium text-text-secondary">
              Duration (days) <span className="text-accent-600">*</span>
            </label>
            <input
              id="duration"
              type="number"
              name="duration_days"
              required
              value={form.duration_days}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
            />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-medium text-text-secondary">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive (draft)</option>
          </select>
        </div>

        {/* Image Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Current Image
            </label>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Current package"
                className="h-48 w-full max-w-md object-cover rounded-xl shadow-md ring-1 ring-border"
              />
            ) : (
              <div className="h-48 w-full max-w-md bg-surface flex items-center justify-center rounded-xl border border-border text-text-secondary">
                No image available
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium text-text-secondary">
              Upload New Image (optional - replaces current)
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-text-secondary file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-100 file:text-primary-800 hover:file:bg-primary-200 file:transition-all file:cursor-pointer"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push("/admin/packages")}
            className="btn-outline px-8 py-3 text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={formLoading}
            className={`btn-primary px-8 py-3 text-base font-semibold ${
              formLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {formLoading ? "Updating..." : "Update Package"}
          </button>
        </div>
      </form>
    </div>
  );
}