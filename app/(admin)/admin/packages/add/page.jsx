// app/admin/packages/add/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowBack, MdImage, MdUpload } from "react-icons/md";
import { z } from "zod";

const packageSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title is too long"),
  category_id: z.string().min(1, "Please select a category"),
  short_description: z
    .string()
    .min(20, "Short description should be at least 20 characters")
    .max(70, "Short description is too long (max 300 characters)"),
  description: z
    .string()
    .min(50, "Full description should be at least 50 characters")
    .optional()
    .or(z.literal("")),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a positive number",
    }),
  duration_days: z
    .string()
    .refine((val) => Number(val) >= 1 && Number.isInteger(Number(val)), {
      message: "Duration must be a whole number of at least 1 day",
    }),
  status: z.enum(["active", "inactive"]),
});

export default function AddPackagePage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    category_id: "",
    short_description: "",
    description: "",
    price: "",
    duration_days: "",
    status: "active",
  });

  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoadingCategories(false);
      })
      .catch(() => {
        setError("Failed to load categories");
        setLoadingCategories(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error for this field on change
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    const result = packageSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0];
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate with Zod before submitting
    if (!validateForm()) {
      setError("Please fix the errors in the form before submitting.");
      return;
    }

    setFormLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch("/api/admin/packages", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create package");

      router.push("/admin/packages");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  if (loadingCategories) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
            Preparing the form...
          </p>
        </div>
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950 p-6 md:p-8 lg:p-10">
  <div className="max-w-5xl mx-auto space-y-10">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-purple-400 font-medium mb-4 transition-colors"
        >
          <MdArrowBack size={20} />
          Back to Packages
        </button>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Create New Package
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Add a luxurious travel experience to your collection
        </p>
      </div>
    </div>

    {/* Error Alert */}
    {error && (
      <div className="bg-red-50/80 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-2xl backdrop-blur-sm">
        <p className="font-semibold">Error</p>
        <p className="mt-1">{error}</p>
      </div>
    )}

    {/* Form Card */}
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
    >
      <div className="p-8 lg:p-12 space-y-10">
        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Title */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Package Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Luxury Safari in Serengeti"
              className={`w-full px-5 py-4 text-lg rounded-2xl border text-white placeholder:text-gray-400 ${
                errors.title
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20"
              } bg-white/70 dark:bg-gray-900/50 outline-none transition-all`}
            />
            {errors.title && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              name="category_id"
              required
              value={form.category_id}
              onChange={handleChange}
              className={`w-full px-5 py-4 text-lg rounded-2xl border text-white placeholder:text-gray-400 ${
                errors.category_id
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20"
              } bg-white/70 dark:bg-gray-900/50 outline-none transition-all`}
            >
              <option value="" className="text-gray-900">
                Choose a category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="text-gray-900">
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.category_id}</p>
            )}
          </div>
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Short Description
            </label>
            <textarea
              name="short_description"
              rows={4}
              value={form.short_description}
              onChange={handleChange}
              placeholder="A captivating summary for listings..."
              className={`w-full px-5 py-4 rounded-2xl border text-white placeholder:text-gray-400 ${
                errors.short_description
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20"
              } bg-white/70 dark:bg-gray-900/50 outline-none transition-all resize-none`}
            />
            {errors.short_description && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.short_description}</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Full Description
            </label>
            <textarea
              name="description"
              rows={8}
              value={form.description}
              onChange={handleChange}
              placeholder="Detailed itinerary, highlights, inclusions, what makes this special..."
              className={`w-full px-5 py-4 rounded-2xl border text-white placeholder:text-gray-400 ${
                errors.description
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20"
              } bg-white/70 dark:bg-gray-900/50 outline-none transition-all resize-y`}
            />
            {errors.description && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Price & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Price (USD) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-gray-500">$</span>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                required
                value={form.price}
                onChange={handleChange}
                placeholder="2999.00"
                className={`w-full pl-12 pr-5 py-4 text-lg rounded-2xl border text-white placeholder:text-gray-400 ${
                  errors.price
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500/20"
                } bg-white/70 dark:bg-gray-900/50 outline-none transition-all`}
              />
            </div>
            {errors.price && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1 ml-12">{errors.price}</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Duration (Days) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="duration_days"
              min="1"
              required
              value={form.duration_days}
              onChange={handleChange}
              placeholder="7"
              className={`w-full px-5 py-4 text-lg rounded-2xl border text-white placeholder:text-gray-400 ${
                errors.duration_days
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500/20"
              } bg-white/70 dark:bg-gray-900/50 outline-none transition-all`}
            />
            {errors.duration_days && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.duration_days}</p>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="max-w-md space-y-3">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Initial Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-5 py-4 text-lg rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-900/50 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all text-white placeholder:text-gray-400"
          >
            <option value="active">Active (Visible on site)</option>
            <option value="inactive">Inactive (Draft)</option>
          </select>
        </div>

        {/* Image Upload */}
        <div className="space-y-6">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Package Hero Image
          </label>

          {!imagePreview ? (
            <label
              htmlFor="image-upload"
              className="block w-full max-w-2xl h-80 border-3 border-dashed border-indigo-300 dark:border-purple-700 rounded-3xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 dark:hover:border-purple-500 transition-all group"
            >
              <MdUpload size={64} className="text-indigo-500 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-xl font-medium text-white">
                Click to upload image
              </p>
              <p className="text-sm text-white/80 mt-2">
                Recommended: High-quality landscape photo (1920x1080)
              </p>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="max-w-3xl space-y-4">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-4 ring-indigo-200 dark:ring-purple-800/50">
                <img
                  src={imagePreview}
                  alt="Package preview"
                  className="w-full h-96 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="absolute top-4 right-4 p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full shadow-lg hover:scale-110 transition-all text-gray-800 dark:text-white"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Looks amazing! This will be the main image for your package.
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            type="submit"
            disabled={formLoading}
            className={`inline-flex items-center gap-3 px-10 py-5 text-xl font-bold text-white rounded-2xl shadow-xl transition-all duration-300 ${
              formLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-2xl hover:scale-105 active:scale-95"
            }`}
          >
            {formLoading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Package...
              </>
            ) : (
              <>
                <MdUpload size={24} />
                Create Package
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