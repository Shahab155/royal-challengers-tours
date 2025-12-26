"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/admin/packages");
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

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPackageToDelete(null);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-text-secondary animate-pulse">Loading packages...</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-text">Packages</h1>
        <Link
          href="/admin/packages/add"
          className="btn-primary whitespace-nowrap"
        >
          + Add New Package
        </Link>
      </div>

      {/* Table Card */}
      <div className="card shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-surface/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
              <tr className="text-text-secondary font-medium text-left">
                <th className="px-5 py-4">Image</th>
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Short Description</th>
                <th className="px-5 py-4 text-right">Price</th>
                <th className="px-5 py-4 text-center">Days</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {packages.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="space-y-4">
                      <p className="text-lg font-medium text-text">No packages found</p>
                      <p className="text-text-secondary">
                        Get started by creating your first travel package!
                      </p>
                      <Link
                        href="/admin/packages/add"
                        className="btn-primary inline-block px-6 py-2.5 text-sm"
                      >
                        + Add Your First Package
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                packages.map((pkg) => (
                  <tr
                    key={pkg.id}
                    className="hover:bg-surface/60 transition-colors duration-150 group"
                  >
                    <td className="px-5 py-4">
                      {pkg.image ? (
                        <img
                          src={`/images/packages/${pkg.image}`}
                          alt={pkg.title}
                          className="h-12 w-16 object-cover rounded-md shadow-sm ring-1 ring-border/50 mx-auto"
                        />
                      ) : (
                        <div className="h-12 w-16 bg-surface rounded-md flex items-center justify-center text-text-secondary text-xs">
                          No image
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 font-medium text-text truncate max-w-xs">
                      {pkg.title}
                    </td>

                    <td className="px-5 py-4 text-text-secondary">
                      {pkg.category_name || "—"}
                    </td>

                    <td className="px-5 py-4 text-text-secondary truncate max-w-sm">
                      {pkg.short_description || "No description"}
                    </td>

                    <td className="px-5 py-4 text-right font-medium">
                      ${Number(pkg.price).toLocaleString()}
                    </td>

                    <td className="px-5 py-4 text-center">
                      {pkg.duration_days} days
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                          pkg.status === "active"
                            ? "bg-primary-100 text-primary-800"
                            : "bg-accent-100 text-accent-800"
                        }`}
                      >
                        {pkg.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right space-x-2">
                      <Link
                        href={`/admin/packages/edit/${pkg.id}`}
                        className="btn-outline text-sm px-4 py-2"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDeleteClick(pkg)}
                        className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 shadow-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && packageToDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="card max-w-md w-full shadow-2xl shadow-primary-900/20 p-8">
            <h3 className="text-xl font-bold text-text mb-3">Confirm Deletion</h3>
            <p className="text-text-secondary mb-6">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-text">"{packageToDelete.title}"</span>?
              <br />
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-6 py-2.5 rounded-lg border border-border text-text-secondary hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md"
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