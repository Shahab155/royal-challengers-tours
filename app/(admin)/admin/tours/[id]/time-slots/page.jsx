"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MdDelete, MdAccessTime, MdGroup, MdTimer } from "react-icons/md";

export default function TimeSlotsPage() {
  const { id } = useParams();

  const [slots, setSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  /* ===== Fetch Slots ===== */
  const fetchSlots = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/tours/${id}/time-slots`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setSlots(data);
    } catch (error) {
      showMessage("error", "Failed to load time slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [id]);

  /* ===== Add Slot ===== */
  const addSlot = async (e) => {
    e.preventDefault();
    if (!startTime || !duration) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/tours/${id}/time-slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_time: startTime,
          duration_minutes: Number(duration),
          capacity: capacity ? Number(capacity) : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to add slot");

      showMessage("success", "Time slot added successfully ✓");
      setStartTime("");
      setDuration("");
      setCapacity("");
      fetchSlots();
    } catch (error) {
      showMessage("error", "Failed to add time slot");
    } finally {
      setSubmitting(false);
    }
  };

  /* ===== Delete Slot ===== */
  const deleteSlot = async (slotId) => {
    if (!confirm("Are you sure you want to delete this time slot?")) return;

    try {
      const res = await fetch(`/api/admin/tours/${id}/time-slots`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId }),
      });

      if (!res.ok) throw new Error("Failed to delete");

      showMessage("success", "Time slot deleted");
      fetchSlots();
    } catch (error) {
      showMessage("error", "Failed to delete time slot");
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-10">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-bold text-gray-900">Daily Time Slots</h1>
        <p className="text-lg text-gray-600 mt-2">
          Manage available time slots for this tour
        </p>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 transition-all ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <span className="text-xl">
            {message.type === "success" ? "✓" : "✕"}
          </span>
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Add New Slot Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold mb-6">Add New Time Slot</h2>
        <form onSubmit={addSlot} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MdAccessTime className="text-blue-600" />
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MdTimer className="text-purple-600" />
              Duration (minutes)
            </label>
            <input
              type="number"
              min="15"
              placeholder="e.g. 60"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MdGroup className="text-green-600" />
              Max Capacity (optional)
            </label>
            <input
              type="number"
              min="1"
              placeholder="Unlimited"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>Adding...</>
              ) : (
                <>
                  <span>+</span> Add Slot
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Time Slots List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h2 className="text-2xl font-bold">Current Time Slots</h2>
          <p className="opacity-90 mt-1">
            {slots.length} {slots.length === 1 ? "slot" : "slots"} configured
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading time slots...</p>
            </div>
          ) : slots.length === 0 ? (
            <div className="p-16 text-center">
              <div className="text-6xl text-gray-300 mb-4">No time slots yet</div>
              <p className="text-lg text-gray-500">
                Add your first time slot using the form above
              </p>
            </div>
          ) : (
            slots.map((slot) => (
              <div
                key={slot.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-gray-50 transition"
              >
                <div className="mb-4 sm:mb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl font-bold text-gray-800">
                      {formatTime(slot.time_slot)}
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {slot.duration_minutes} min
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {slot.capacity ? (
                      <>Max {slot.capacity} participants</>
                    ) : (
                      <>Unlimited capacity</>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteSlot(slot.id)}
                  className="px-5 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition flex items-center gap-2 group"
                  title="Delete this time slot"
                >
                  <MdDelete className="text-xl group-hover:scale-110 transition" />
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}