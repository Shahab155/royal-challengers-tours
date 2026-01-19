// app/admin/tours/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdEventAvailable,
  MdViewList,
  MdSchedule,
} from "react-icons/md";

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

    const res = await fetch(`/api/admin/tours/${tourToDelete.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setTours((prev) => prev.filter((t) => t.id !== tourToDelete.id));
      setShowDeleteModal(false);
      setTourToDelete(null);
    } else {
      alert("Failed to delete tour");
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

        {/* Table */}
        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-sm">
              <thead className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/40 dark:to-purple-950/40 border-b border-gray-200/50 dark:border-gray-700/50">
                <tr className="text-gray-700 dark:text-gray-300 font-semibold text-left">
                  <th className="px-6 py-5">ID</th>
                  <th className="px-6 py-5">Title</th>
                  <th className="px-6 py-5">Short Description</th>
                  <th className="px-6 py-5 text-right">Price</th>
                  <th className="px-6 py-5 text-center">Status</th>
                  <th className="px-6 py-5 text-center">Image</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                {tours.map((tour) => (
                  <tr
                    key={tour.id}
                    className="group hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition"
                  >
                    <td className="px-6 py-5 font-medium">
                      {tour.id}
                    </td>

                    <td className="px-6 py-5 font-medium text-gray-900 dark:text-white truncate max-w-xs">
                      {tour.title}
                    </td>

                    <td className="px-6 py-5 text-gray-600 dark:text-gray-400 truncate max-w-md">
                      {tour.short_description || "—"}
                    </td>

                    <td className="px-6 py-5 text-right font-medium text-emerald-600 dark:text-emerald-400">
                      ${Number(tour.price).toLocaleString()}
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
                        <img
                          src={`/images/tours/${tour.image}`}
                          alt={tour.title}
                          className="h-12 w-12 object-cover rounded-lg shadow-md ring-1 ring-gray-200/50 dark:ring-gray-700/50"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Link
                          href={`/admin/tours/edit/${tour.id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60"
                        >
                          <MdEdit size={16} /> Edit
                        </Link>

                        <Link
                          href={`/admin/tours/${tour.id}/availability`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/60"
                        >
                          <MdEventAvailable size={16} /> Availability
                        </Link>

                        <Link
                          href={`/admin/tours/${tour.id}/sections`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60"
                        >
                          <MdViewList size={16} /> Sections
                        </Link>

                        <Link
                          href={`/admin/tours/${tour.id}/time-slots`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60"
                        >
                          <MdSchedule size={16} /> Time Slots
                        </Link>

                        <button
                          onClick={() => handleDeleteClick(tour)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/60"
                        >
                          <MdDelete size={16} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Modal (unchanged) */}
        {showDeleteModal && tourToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 dark:bg-gray-900/95 rounded-3xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-4 text-red-600">
                Confirm Deletion
              </h3>
              <p className="mb-6">
                Are you sure you want to delete{" "}
                <strong>{tourToDelete.title}</strong>?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={cancelDelete}
                  className="px-6 py-3 rounded-xl border"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-3 rounded-xl bg-red-600 text-white"
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
