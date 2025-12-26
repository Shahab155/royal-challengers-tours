"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ToursPage() {
  const [tours, setTours] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tourToDelete, setTourToDelete] = useState(null);

  useEffect(() => {
    fetch("/api/admin/tours")
      .then((res) => res.json())
      .then(setTours)
      .catch(console.error);
  }, []);

  const handleDeleteClick = (tour) => {
    setTourToDelete(tour);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!tourToDelete) return;

    try {
      const res = await fetch(`/api/admin/tours/${tourToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Optimistic update - remove from list immediately
        setTours((prev) => prev.filter((t) => t.id !== tourToDelete.id));
        setShowDeleteModal(false);
        setTourToDelete(null);
        // Optional: add success toast here in the future
      } else {
        alert("Failed to delete tour. Please try again.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the tour.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTourToDelete(null);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-text">Tours</h1>
        <Link href="/admin/tours/add" className="btn-primary whitespace-nowrap">
          + Add New Tour
        </Link>
      </div>

      {/* Table Card */}
      <div className="card shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-surface/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
              <tr className="text-text-secondary font-medium text-left">
                <th className="px-5 py-4">ID</th>
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">Slug</th>
                <th className="px-5 py-4">Short Desc</th>
                <th className="px-5 py-4 text-right">Price</th>
                <th className="px-5 py-4 text-center">Days</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4 text-center">Image</th>
                <th className="px-5 py-4">Created</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {tours.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-text-secondary">
                    No tours found. Create your first tour!
                  </td>
                </tr>
              ) : (
                tours.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-surface/60 transition-colors duration-150 group"
                  >
                    <td className="px-5 py-4 font-medium text-text">{t.id}</td>
                    <td className="px-5 py-4 font-medium text-text truncate max-w-xs">
                      {t.title}
                    </td>
                    <td className="px-5 py-4 text-text-secondary truncate max-w-xs">
                      {t.slug}
                    </td>
                    <td className="px-5 py-4 text-text-secondary truncate max-w-xs">
                      {t.short_description}
                    </td>
                    <td className="px-5 py-4 text-text-secondary">{t.category_id}</td>
                    <td className="px-5 py-4 text-right font-medium">
                      ${Number(t.price).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-center">{t.duration_days}</td>
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                          t.status === "active"
                            ? "bg-primary-100 text-primary-800"
                            : "bg-accent-100 text-accent-800"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {t.image ? (
                        <img
                          src={`/images/tours/${t.image}`}
                          alt={t.title}
                          className="h-10 w-10 object-cover rounded-md mx-auto shadow-sm ring-1 ring-border/50"
                        />
                      ) : (
                        <span className="text-text-secondary text-xs">—</span>
                      )}
                    </td>
                    
                    <td className="px-5 py-4 text-right space-x-2">
                      <Link
                        href={`/admin/tours/edit/${t.id}`}
                        className="btn-outline text-sm px-4 py-2"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDeleteClick(t)}
                        className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 active:bg-red-800 transition-all duration-200 shadow-sm"
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
      {showDeleteModal && tourToDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="card max-w-md w-full shadow-2xl shadow-primary-900/20 p-8">
            <h3 className="text-xl font-bold text-text mb-3">Confirm Deletion</h3>
            <p className="text-text-secondary mb-6">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-text">"{tourToDelete.title}"</span>?
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
                className="px-6 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 active:bg-red-800 transition-colors shadow-md"
              >
                Delete Tour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}