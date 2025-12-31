// app/admin/packages/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MdAdd, MdEdit, MdDelete, MdRefresh } from "react-icons/md";

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/packages");
      if (!res.ok) throw new Error("Failed to fetch packages");
      const data = await res.json();
      setPackages(data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDeleteClick = (pkg) => {
    setPackageToDelete(pkg);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!packageToDelete) return;

    try {
      const res = await fetch(`/api/admin/packages/${packageToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPackages((prev) => prev.filter((p) => p.id !== packageToDelete.id));
        setShowDeleteModal(false);
        setPackageToDelete(null);
      } else {
        alert("Failed to delete package");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950 p-6 md:p-8 lg:p-10">
      <div className="max-w-full mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Travel Packages
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
              Manage your collection of luxury travel experiences
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchPackages}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all disabled:opacity-50"
            >
              <MdRefresh size={18} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <Link
              href="/admin/packages/add"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <MdAdd size={22} />
              Add New Package
            </Link>
          </div>
        </div>

        {/* Packages Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6" />
            <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
              Loading packages...
            </p>
          </div>
        ) : packages.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-16 text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center">
              <MdAdd size={48} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                No packages yet
              </h3>
              <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Start building your luxury travel offerings by adding your first package.
              </p>
            </div>
            <Link
              href="/admin/packages/add"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all mx-auto"
            >
              <MdAdd size={20} />
              Create Your First Package
            </Link>
          </div>
        ) : (
          <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] text-sm">
                <thead className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/40 dark:to-purple-950/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10">
                  <tr className="text-gray-700 dark:text-gray-300 font-semibold text-left uppercase tracking-wider">
                    <th className="px-6 py-5">Image</th>
                    <th className="px-6 py-5">Title</th>
                    <th className="px-6 py-5">Category</th>
                    <th className="px-6 py-5">Short Description</th>
                    <th className="px-6 py-5 text-right">Price</th>
                    <th className="px-6 py-5 text-center">Duration</th>
                    <th className="px-6 py-5 text-center">Status</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                  {packages.map((pkg, index) => (
                    <tr
                      key={pkg.id}
                      className={`group transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 ${
                        index % 2 === 0 ? "bg-white/40 dark:bg-gray-800/30" : "bg-gray-50/30 dark:bg-gray-800/20"
                      }`}
                    >
                      <td className="px-6 py-5">
                        {pkg.image ? (
                          <div className="relative w-20 h-14 rounded-xl overflow-hidden shadow-md ring-1 ring-indigo-200/50 dark:ring-indigo-800/50">
                            <img
                              src={`/images/packages/${pkg.image}`}
                              alt={pkg.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-14 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center">
                            <MdAdd size={28} className="text-gray-500 dark:text-gray-600" />
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-semibold text-gray-900 dark:text-white text-base truncate max-w-xs">
                          {pkg.title}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-gray-600 dark:text-gray-400">
                        {pkg.category_name || "—"}
                      </td>

                      <td className="px-6 py-5 text-gray-600 dark:text-gray-400 max-w-md">
                        <p className="line-clamp-2">
                          {pkg.short_description || "No description"}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                          ${Number(pkg.price).toLocaleString()}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded-full font-medium">
                          {pkg.duration_days} days
                        </span>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex px-4 py-1.5 text-xs font-semibold rounded-full ${
                            pkg.status === "active"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                          }`}
                        >
                          {pkg.status?.toUpperCase() || "DRAFT"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/packages/edit/${pkg.id}`}
                            className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300"
                          >
                            <MdEdit size={18} />
                          </Link>

                          <button
                            onClick={() => handleDeleteClick(pkg)}
                            className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300"
                          >
                            <MdDelete size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && packageToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Are you sure you want to permanently delete
              <br />
              <span className="font-semibold text-gray-900 dark:text-white">
                "{packageToDelete.title}"
              </span>
              ?
            </p>
            <p className="text-sm text-red-600 dark:text-red-400 mb-8">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-8 py-3.5 rounded-2xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Delete Package
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}