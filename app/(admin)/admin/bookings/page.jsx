// app/admin/bookings/page.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { MdRefresh } from "react-icons/md";

async function getBookings() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/admin/bookings`, {
      cache: "no-store",
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Bookings fetch error:", error);
    return [];
  }
}

function formatDate(input) {
  if (!input) return "—";
  try {
    const date = new Date(input);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "—";
  }
}

const statusStyles = {
  new: "bg-blue-100/80 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700/50",
  contacted: "bg-purple-100/80 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700/50",
  confirmed: "bg-green-100/80 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700/50",
  completed: "bg-indigo-100/80 text-indigo-800 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700/50",
  cancelled: "bg-red-100/80 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700/50",
  unknown: "bg-gray-100/80 text-gray-800 border-gray-200 dark:bg-gray-800/40 dark:text-gray-300 dark:border-gray-700/50",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const fetchBookings = () => {
    getBookings().then(setBookings);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const possibleStatuses = ["new", "contacted", "confirmed", "completed", "cancelled"];

  const updateBookingStatus = async (bookingId, newStatus) => {
    // Optimistic update
    const optimisticBookings = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: newStatus } : b
    );
    setBookings(optimisticBookings);

    startTransition(async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/admin/bookings/${bookingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!res.ok) throw new Error("Failed to update status");
      } catch (err) {
        setError("Failed to update booking status");
        setBookings(bookings); // revert on error
        console.error(err);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950 p-6 md:p-8 lg:p-10">
      <div className="max-w-full mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Bookings Overview
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
              Manage all incoming travel bookings in real time
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchBookings}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all disabled:opacity-50"
            >
              <MdRefresh size={18} className={isPending ? "animate-spin" : ""} />
              Refresh
            </button>

            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 px-4 py-2 bg-white/70 dark:bg-gray-900/50 rounded-xl shadow-sm">
              {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50/80 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-2xl backdrop-blur-sm">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-16 text-center space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              No bookings yet
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              New reservations will appear here as soon as customers complete their booking.
            </p>
          </div>
        ) : (
          <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] text-sm">
                <thead className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/40 dark:to-purple-950/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10">
                  <tr className="text-gray-700 dark:text-gray-300 font-semibold text-left">
                    <th className="px-6 py-5">Type</th>
                    <th className="px-6 py-5">Item</th>
                    <th className="px-6 py-5">Customer</th>
                    <th className="px-6 py-5">Contact</th>
                    <th className="px-6 py-5 text-center">Travel Date</th>
                    <th className="px-6 py-5 text-center">Travelers</th>
                    <th className="px-6 py-5 text-center">Status</th>
                    <th className="px-6 py-5 text-right">Created</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="group hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-5 capitalize font-medium text-gray-900 dark:text-white">
                        {booking.booking_type || "Custom"}
                      </td>
                      <td className="px-6 py-5 font-medium text-gray-900 dark:text-white truncate max-w-xs">
                        {booking.item_title || "Custom Booking"}
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {booking.full_name || "—"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {booking.email}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-gray-600 dark:text-gray-400">
                        {booking.phone || "—"}
                      </td>
                      <td className="px-6 py-5 text-center">
                        {booking.travel_date ? (
                          <div>
                            <div className="font-medium text-amber-600 dark:text-amber-400">
                              {new Date(booking.travel_date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {booking.travelers ?? 0} pax
                            </div>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-5 text-center font-medium text-indigo-600 dark:text-indigo-400">
                        {booking.travelers ?? "—"}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <select
                          value={booking.status || "new"}
                          onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                          disabled={isPending}
                          className={`
                            min-w-[140px] px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer
                            disabled:opacity-60 disabled:cursor-not-allowed
                            ${statusStyles[booking.status?.toLowerCase()] || statusStyles.unknown}
                          `}
                        >
                          {possibleStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-5 text-right text-gray-500 dark:text-gray-400 text-sm">
                        {formatDate(booking.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}