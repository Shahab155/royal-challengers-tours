// app/admin/tours/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";

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
        setTours((prev) => prev.filter((t) => t.id !== tourToDelete.id));
        setShowDeleteModal(false);
        setTourToDelete(null);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950 p-6 md:p-8 lg:p-10">
      <div className="max-w-full mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Tours Management
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
              View, edit and manage all your luxury tours
            </p>
          </div>

          <Link
            href="/admin/tours/add"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <MdAdd size={22} />
            Add New Tour
          </Link>
        </div>

        {/* Table Card */}
        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/40 dark:to-purple-950/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10">
                <tr className="text-gray-700 dark:text-gray-300 font-semibold text-left">
                  <th className="px-6 py-5">ID</th>
                  <th className="px-6 py-5">Title</th>
                  <th className="px-6 py-5">Slug</th>
                  <th className="px-6 py-5">Short Desc</th>
                  <th className="px-6 py-5 text-right">Price</th>
                  <th className="px-6 py-5 text-center">Days</th>
                  <th className="px-6 py-5 text-center">Status</th>
                  <th className="px-6 py-5 text-center">Image</th>
                  <th className="px-6 py-5">Created</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                {tours.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-24 text-center">
                      <div className="space-y-4">
                        <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
                          No tours found yet
                        </p>
                        <p className="text-gray-500 dark:text-gray-500">
                          Start by creating your first luxury tour experience
                        </p>
                        <Link
                          href="/admin/tours/add"
                          className="inline-block mt-4 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        >
                          + Create First Tour
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tours.map((tour) => (
                    <tr
                      key={tour.id}
                      className="group hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-5 font-medium text-gray-800 dark:text-gray-200">
                        {tour.id}
                      </td>
                      <td className="px-6 py-5 font-medium text-gray-900 dark:text-white truncate max-w-xs">
                        {tour.title}
                      </td>
                      <td className="px-6 py-5 text-gray-600 dark:text-gray-400 truncate max-w-xs">
                        {tour.slug}
                      </td>
                      <td className="px-6 py-5 text-gray-600 dark:text-gray-400 truncate max-w-xs">
                        {tour.short_description}
                      </td>
                      <td className="px-6 py-5 text-right font-medium text-emerald-600 dark:text-emerald-400">
                        ${Number(tour.price).toLocaleString()}
                      </td>
                      <td className="px-6 py-5 text-center font-medium text-amber-600 dark:text-amber-400">
                        {tour.duration_days}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex px-4 py-1.5 text-xs font-semibold rounded-full ${
                            tour.status === "active"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                          }`}
                        >
                          {tour.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        {tour.image ? (
                          <div className="inline-block relative group/image">
                            <img
                              src={`/images/tours/${tour.image}`}
                              alt={tour.title}
                              className="h-12 w-12 object-cover rounded-lg shadow-md ring-1 ring-gray-200/50 dark:ring-gray-700/50 transition-transform group-hover/image:scale-110"
                            />
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-gray-500 dark:text-gray-400 text-sm">
                        {new Date(tour.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5 text-right space-x-3">
                        <Link
                          href={`/admin/tours/edit/${tour.id}`}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all"
                        >
                          <MdEdit size={16} />
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDeleteClick(tour)}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/60 transition-all"
                        >
                          <MdDelete size={16} />
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-w-md w-full p-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-8">
                Are you sure you want to permanently delete
                <br />
                <span className="font-semibold text-gray-900 dark:text-white">
                  "{tourToDelete.title}"
                </span>
                ?
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mb-8">
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={cancelDelete}
                  className="px-8 py-3.5 rounded-2xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Delete Tour
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}