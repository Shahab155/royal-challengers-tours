"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    setLoading(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, status }),
      });

      if (!res.ok) {
        throw new Error("Failed to create category");
      }

      router.push("/admin/categories");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text">
          Create New Category
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
        {/* Category Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-text-secondary">
            Category Name <span className="text-accent-600">*</span>
          </label>
          <input
            id="name"
            required
            placeholder="e.g. Adventure Tours"
            className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Applies To */}
        <div className="space-y-2">
          <label htmlFor="type" className="block text-sm font-medium text-text-secondary">
            Applies To <span className="text-accent-600">*</span>
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
          >
            <option value="both">Both (Tours & Packages)</option>
            <option value="tour">Tours Only</option>
            <option value="package">Packages Only</option>
          </select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-medium text-text-secondary">
            Initial Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`btn-primary px-8 py-3 text-base font-semibold min-w-[180px] ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating..." : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
}