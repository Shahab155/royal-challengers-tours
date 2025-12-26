"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditCategory() {
  const router = useRouter();
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });

      if (!res.ok) throw new Error("Failed to update category");

      router.push("/admin/categories");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-text-secondary animate-pulse">Loading category...</div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-accent-100/50 border border-accent-300 text-accent-800 p-6 rounded-xl text-center">
          <p className="text-lg font-medium">{error || "Category not found"}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 btn-outline px-6 py-2"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text">
          Edit Category
        </h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-text-secondary hover:text-text transition-colors"
        >
          ← Back
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-accent-100/50 border border-accent-300 text-accent-800 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-8 shadow-lg space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-text-secondary"
          >
            Category Name <span className="text-accent-600">*</span>
          </label>
          <input
            id="name"
            name="name"
            required
            value={category.name || ""}
            onChange={handleChange}
            placeholder="e.g. Adventure Tours"
            className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
          />
        </div>

        {/* Type */}
        <div className="space-y-2">
          <label
            htmlFor="type"
            className="block text-sm font-medium text-text-secondary"
          >
            Applies To <span className="text-accent-600">*</span>
          </label>
          <select
            id="type"
            name="type"
            required
            value={category.type || "both"}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
          >
            <option value="both">Both (Tours & Packages)</option>
            <option value="tour">Tours Only</option>
            <option value="package">Packages Only</option>
          </select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-text-secondary"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={category.status || "active"}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push("/admin/categories")}
            className="btn-outline px-8 py-3 text-base"
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className={`btn-primary px-8 py-3 text-base font-semibold min-w-[160px] ${
              saving ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {saving ? "Updating..." : "Update Category"}
          </button>
        </div>
      </form>
    </div>
  );
}