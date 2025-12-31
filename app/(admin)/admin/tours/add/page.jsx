"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MdArrowBack, MdUpload } from "react-icons/md";

// Zod Schema
const tourSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category_id: z.string().min(1, "Please select a category"),
  short_description: z.string().optional(),
  description: z.string().optional(),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a positive number",
    }),
  duration_days: z
    .string()
    .min(1, "Duration is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
      message: "Duration must be at least 1 day",
    }),
  status: z.enum(["active", "inactive"]),
  image: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Hero image is required")
    .refine((files) => files[0]?.size <= 10 * 1024 * 1024, "Image must be under 10MB")
    .refine(
      (files) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(files[0]?.type),
      "Only JPG, PNG, or WebP images are allowed"
    ),
});

export default function AddTourPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      status: "active",
    },
  });

  // Watch image file to generate preview
  const imageFileList = watch("image");

  useEffect(() => {
    if (imageFileList && imageFileList.length > 0) {
      const file = imageFileList[0];
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [imageFileList]);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => {
        console.error("Failed to load categories");
        setLoading(false);
      });
  }, []);

  const onSubmit = async (data) => {
    setSubmitLoading(true);
    const formData = new FormData();

    // Append all fields
    formData.append("title", data.title);
    formData.append("category_id", data.category_id);
    formData.append("short_description", data.short_description || "");
    formData.append("description", data.description || "");
    formData.append("price", data.price);
    formData.append("duration_days", data.duration_days);
    formData.append("status", data.status);
    formData.append("image", data.image[0]);

    try {
      const res = await fetch("/api/admin/tours", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.push("/admin/tours");
      } else {
        const error = await res.text();
        alert("Failed to create tour: " + error);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

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
              Back to Tours
            </button>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Create New Tour
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
              Add an unforgettable luxury travel adventure
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6" />
            <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
              Loading categories...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
          >
            <div className="p-8 lg:p-12 space-y-10">
              {/* Title + Category */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Tour Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("title")}
                    placeholder="e.g. Discover the Northern Lights in Iceland"
                    className={`w-full px-5 py-4 text-lg rounded-2xl border ${
                      errors.title
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                    } bg-white/70 dark:bg-gray-900/50 text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    {...register("category_id")}
                    className={`w-full px-5 py-4 text-lg rounded-2xl border ${
                      errors.category_id
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20"
                    } bg-white/70 dark:bg-gray-900/50 text-gray-900 dark:text-white outline-none transition-all appearance-none`}
                  >
                    <option value="">Choose a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.category_id.message}</p>
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
                    {...register("short_description")}
                    rows={4}
                    placeholder="Brief overview shown in listings..."
                    className="w-full px-5 py-4 text-lg rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Full Description
                  </label>
                  <textarea
                    {...register("description")}
                    rows={8}
                    placeholder="Detailed itinerary, inclusions, highlights..."
                    className="w-full px-5 py-4 text-lg rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all resize-y placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Price, Duration, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Price (USD) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-gray-500 dark:text-gray-400">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register("price")}
                      placeholder="2999.00"
                      className={`w-full pl-12 pr-5 py-4 text-lg rounded-2xl border ${
                        errors.price
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500/20"
                      } bg-white/70 dark:bg-gray-900/50 text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1 ml-12">{errors.price.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Duration (Days) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register("duration_days")}
                    placeholder="e.g. 7"
                    className={`w-full px-5 py-4 text-lg rounded-2xl border ${
                      errors.duration_days
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-300 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500/20"
                    } bg-white/70 dark:bg-gray-900/50 text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                  />
                  {errors.duration_days && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.duration_days.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Initial Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full px-5 py-4 text-lg rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all appearance-none"
                  >
                    <option value="active">Active (Visible on site)</option>
                    <option value="inactive">Inactive (Draft)</option>
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-6">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Tour Hero Image <span className="text-rose-500">*</span>
                </label>

                {!imagePreview ? (
                  <label
                    htmlFor="image-upload"
                    className="block w-full max-w-2xl h-80 border-3 border-dashed border-indigo-300 dark:border-purple-700 rounded-3xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 dark:hover:border-purple-500 transition-all group"
                  >
                    <MdUpload size={64} className="text-indigo-500 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                    <p className="text-xl font-medium text-indigo-700 dark:text-indigo-300">
                      Click to upload image
                    </p>
                    <p className="text-sm text-indigo-600/80 dark:text-indigo-400/80 mt-2">
                      Recommended: High-quality landscape (1920×1080)
                    </p>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      {...register("image")}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="max-w-3xl space-y-4">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-4 ring-indigo-200 dark:ring-purple-800/50">
                      <img
                        src={imagePreview}
                        alt="Tour preview"
                        className="w-full h-96 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setValue("image", null);
                        }}
                        className="absolute top-4 right-4 p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full shadow-lg hover:scale-110 transition-all text-gray-800 dark:text-white"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      Looks perfect! This will be the main hero image.
                    </p>
                  </div>
                )}

                {errors.image && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2">{errors.image.message}</p>
                )}
              </div>

              {/* Submit */}
              <div className="pt-8 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className={`inline-flex items-center gap-3 px-10 py-5 text-xl font-bold text-white rounded-2xl shadow-xl transition-all duration-300 ${
                    submitLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-2xl hover:scale-105 active:scale-95"
                  }`}
                >
                  {submitLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Tour...
                    </>
                  ) : (
                    <>
                      <MdUpload size={24} />
                      Create Tour
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}