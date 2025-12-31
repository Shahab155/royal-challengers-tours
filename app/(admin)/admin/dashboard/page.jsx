// app/admin/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";
import {
  MdCategory,
  MdCardTravel,
  MdTour,
  MdLocalActivity,
  MdBookOnline,
  MdTrendingUp,
  MdCalendarToday,
  MdAccessTime,
} from "react-icons/md";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    categories: 0,
    packages: 0,
    tours: 0,
    activeTours: 0,
    totalBookings: 0,
    todayBookings: 0,
    pendingBookings: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [catRes, pkgRes, tourRes, bookingRes] = await Promise.all([
          fetch("/api/admin/categories"),
          fetch("/api/admin/packages"),
          fetch("/api/admin/tours"),
          fetch("/api/admin/bookings"),
        ]);

        const categories = await catRes.json();
        const packages = await pkgRes.json();
        const tours = await tourRes.json();
        const bookings = await bookingRes.json();

        const today = new Date().toISOString().split("T")[0];

        setStats({
          categories: categories.length,
          packages: packages.length,
          tours: tours.length,
          activeTours: tours.filter((t) => t.status === "active").length,
          totalBookings: bookings.length,
          todayBookings: bookings.filter(
            (b) => new Date(b.created_at).toISOString().split("T")[0] === today
          ).length,
          pendingBookings: bookings.filter(
            (b) => b.status?.toLowerCase() === "pending" || !b.status
          ).length,
        });

        setRecentBookings(bookings.slice(0, 6)); // Show 6 for better layout
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Royal Challengers Travelers • Overview
            </p>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <MdCalendarToday className="text-xl" />
            <span className="font-medium">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Main Stats Grid - Colorful Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ColorfulStatCard
            title="Categories"
            value={stats.categories}
            icon={<MdCategory />}
            gradient="from-purple-500 to-pink-500"
            loading={loading}
          />
          <ColorfulStatCard
            title="Packages"
            value={stats.packages}
            icon={<MdCardTravel />}
            gradient="from-blue-500 to-cyan-500"
            loading={loading}
          />
          <ColorfulStatCard
            title="Total Tours"
            value={stats.tours}
            icon={<MdTour />}
            gradient="from-emerald-500 to-teal-500"
            loading={loading}
          />
          <ColorfulStatCard
            title="Active Tours"
            value={stats.activeTours}
            icon={<MdLocalActivity />}
            gradient="from-orange-500 to-amber-500"
            loading={loading}
          />
        </div>

        {/* Booking Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <HighlightCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={<MdBookOnline />}
            color="indigo"
            loading={loading}
          />
          <HighlightCard
            title="Today's Bookings"
            value={stats.todayBookings}
            icon={<MdTrendingUp />}
            color="emerald"
            loading={loading}
          />
          <HighlightCard
            title="Pending Approval"
            value={stats.pendingBookings}
            icon={<MdAccessTime />}
            color={stats.pendingBookings > 0 ? "amber" : "gray"}
            warning={stats.pendingBookings > 0}
            loading={loading}
          />
        </div>

        {/* Recent Bookings Table */}
        <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Recent Bookings
            </h2>

            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200/70 dark:bg-gray-700/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p className="text-lg">No bookings yet</p>
                <p className="text-sm mt-2">New reservations will appear here automatically</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking, index) => (
                  <div
                    key={booking.id}
                    className={`p-5 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5 ${
                      index % 2 === 0
                        ? "bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20"
                        : "bg-white/60 dark:bg-gray-700/40"
                    } border border-gray-200/60 dark:border-gray-600/40`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {booking.full_name || "Guest"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {booking.booking_type} • {booking.item_title || "Custom Tour"}
                        </p>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="text-gray-700 dark:text-gray-300 font-medium">
                            {new Date(booking.created_at).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                          <p className="text-gray-500 dark:text-gray-500">
                            {new Date(booking.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <BookingStatus status={booking.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* Colorful Gradient Stat Card */
function ColorfulStatCard({ title, value, icon, gradient, loading }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 group">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`} />
      <div className="relative p-6 text-white">
        {loading ? (
          <div className="space-y-4">
            <div className="h-5 w-32 bg-white/30 rounded animate-pulse" />
            <div className="h-10 w-20 bg-white/40 rounded animate-pulse" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm font-medium uppercase tracking-wider">
                  {title}
                </p>
                <p className="text-4xl font-bold mt-3">{value}</p>
              </div>
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                {icon}
              </div>
            </div>
            <div className="mt-6 h-1 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white/60 rounded-full animate-pulse w-3/4" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* Highlight Card (Secondary Stats) */
function HighlightCard({ title, value, icon, color, warning = false, loading }) {
  const colors = {
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    gray: "bg-gray-500",
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-gray-200/60 dark:border-gray-700/50 hover:shadow-xl transition-shadow">
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600 dark:text-gray-400 font-medium">{title}</p>
            <div className={`p-3 rounded-xl ${colors[color]} text-white shadow-lg`}>
              {icon}
            </div>
          </div>
          <p className={`text-3xl font-bold ${warning ? "text-amber-600 dark:text-amber-400" : "text-gray-900 dark:text-white"}`}>
            {value}
          </p>
          {warning && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 font-medium">
              Requires attention
            </p>
          )}
        </>
      )}
    </div>
  );
}

/* Enhanced Booking Status Badge */
function BookingStatus({ status }) {
  const normalized = (status || "pending").toLowerCase();

  const variants = {
    pending: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300",
    confirmed: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300",
    cancelled: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300",
    completed: "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-300",
  };

  return (
    <span
      className={`px-4 py-2 rounded-full text-xs font-semibold border uppercase tracking-wider ${
        variants[normalized] ||
        "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/50 dark:text-gray-300"
      }`}
    >
      {normalized === "pending" ? "Awaiting" : normalized.charAt(0).toUpperCase() + normalized.slice(1)}
    </span>
  );
}