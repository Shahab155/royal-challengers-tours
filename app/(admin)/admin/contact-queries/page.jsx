// app/admin/contact-queries/page.tsx
"use client";

import { useEffect, useState } from "react";
import { MdRefresh } from "react-icons/md";

export default function ContactInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/contact", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch inquiries: ${res.status}`);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format - expected array");
      }

      setInquiries(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load contact inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950 p-6 md:p-8 lg:p-10">
      <div className="max-w-full mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Contact Inquiries
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
              View and manage all incoming messages from potential travelers
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchInquiries}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all disabled:opacity-50"
            >
              <MdRefresh size={18} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 px-4 py-2 bg-white/70 dark:bg-gray-900/50 rounded-xl shadow-sm">
              {inquiries.length} {inquiries.length === 1 ? "inquiry" : "inquiries"}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50/80 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-2xl backdrop-blur-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6" />
            <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
              Loading inquiries...
            </p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-16 text-center space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              No inquiries yet
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              New contact messages will appear here as soon as someone submits the form.
            </p>
          </div>
        ) : (
          <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-sm">
                <thead className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/40 dark:to-purple-950/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10">
                  <tr className="text-gray-700 dark:text-gray-300 font-semibold text-left">
                    <th className="px-6 py-5">Name</th>
                    <th className="px-6 py-5">Email</th>
                    <th className="px-6 py-5">Phone</th>
                    <th className="px-6 py-5">Package/Tour</th>
                    <th className="px-6 py-5">Message</th>
                    <th className="px-6 py-5">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                  {inquiries.map((inq) => (
                    <tr
                      key={inq.id}
                      className="group hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-5 font-medium text-gray-900 dark:text-white">
                        {inq.name || "—"}
                      </td>
                      <td className="px-6 py-5 text-indigo-600 dark:text-indigo-400">
                        {inq.email || "—"}
                      </td>
                      <td className="px-6 py-5 text-gray-600 dark:text-gray-400">
                        {inq.phone || "—"}
                      </td>
                      <td className="px-6 py-5 text-gray-900 dark:text-white truncate max-w-xs">
                        {inq.package || inq.tour || "—"}
                      </td>
                      <td className="px-6 py-5 max-w-md">
                        <div className="text-gray-700 dark:text-gray-300 line-clamp-2" title={inq.message}>
                          {inq.message || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">
                        {new Date(inq.createdAt || inq.created_at).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
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