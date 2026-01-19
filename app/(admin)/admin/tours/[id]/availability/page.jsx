"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MdCalendarToday, MdDeleteForever, MdInfoOutline } from "react-icons/md";

export default function AvailabilityRangePage() {
  const { id } = useParams();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [existingRange, setExistingRange] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // Fetch current range
  useEffect(() => {
    fetch(`/api/admin/tours/${id}/availability-range`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.start_date && data?.end_date) {
          setExistingRange(data);
        }
      })
      .catch(() => {});
  }, [id]);

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: "", message: "" }), 4500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!startDate || !endDate) {
      showStatus("error", "Both dates are required");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      showStatus("error", "Start date must be before end date");
      return;
    }

    if (start.getTime() === end.getTime()) {
      showStatus("error", "Start and end date cannot be the same day");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/tours/${id}/availability-range`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start_date: startDate, end_date: endDate }),
      });

      if (!res.ok) throw new Error();

      showStatus("success", "Availability range saved successfully");
      setExistingRange({ start_date: startDate, end_date: endDate });
      setStartDate("");
      setEndDate("");
    } catch {
      showStatus("error", "Failed to save availability range");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this availability range? This action cannot be undone.")) return;

    setDeleteLoading(true);

    try {
      const res = await fetch(`/api/admin/tours/${id}/availability-range`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      showStatus("success", "Availability range has been removed");
      setExistingRange(null);
    } catch {
      showStatus("error", "Failed to delete availability range");
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto px-5 py-8 md:py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Tour Availability
        </h1>
        <p className="mt-2 text-gray-600">
          Define the period when this tour is available for booking
        </p>
      </div>

      {/* Status Messages */}
      {status.message && (
        <div
          className={`mb-8 p-4 rounded-xl border flex items-center gap-3 ${
            status.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {status.type === "success" ? (
            <span className="text-xl">✓</span>
          ) : (
            <MdInfoOutline size={22} />
          )}
          <span className="font-medium">{status.message}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-10">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6 text-white">
          <h2 className="text-2xl font-semibold">Set Availability Period</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MdCalendarToday className="text-indigo-600" />
                Start Date
              </label>
              <input
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MdCalendarToday className="text-indigo-600" />
                End Date
              </label>
              <input
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-3.5 px-6 rounded-xl font-semibold text-white transition-all
              ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg active:scale-[0.98]"
              }
            `}
          >
            {loading ? "Saving..." : "Save Availability Range"}
          </button>
        </form>
      </div>

      {/* Current Status Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-8 py-5 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Current Availability Status
          </h2>
        </div>

        <div className="p-8">
          {existingRange ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-gray-50 rounded-xl p-7">
                <div>
                  <div className="text-sm text-gray-600 mb-1">From</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatDate(existingRange.start_date)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Until</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatDate(existingRange.end_date)}
                  </div>
                </div>
              </div>

              <div className="flex justify-center sm:justify-end">
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className={`
                    flex items-center gap-2 px-7 py-3 rounded-xl font-medium transition-all
                    ${
                      deleteLoading
                        ? "bg-red-400 text-white cursor-not-allowed"
                        : "bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200"
                    }
                  `}
                >
                  <MdDeleteForever size={20} />
                  {deleteLoading ? "Deleting..." : "Delete Range"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl text-gray-200 mb-4">📅</div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No availability range set yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Use the form above to define when this tour is available for
                bookings
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}