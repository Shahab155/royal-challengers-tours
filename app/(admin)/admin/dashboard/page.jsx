"use client";

import { useEffect, useState } from "react";
import {
  MdCategory,
  MdCardTravel,
  MdTour,
  MdLocalActivity,
} from "react-icons/md";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    categories: 0,
    packages: 0,
    tours: 0,
    activeTours: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [catRes, pkgRes, tourRes] = await Promise.all([
          fetch("/api/admin/categories"),
          fetch("/api/admin/packages"),
          fetch("/api/admin/tours"),
        ]);

        const categories = await catRes.json();
        const packages = await pkgRes.json();
        const tours = await tourRes.json();

        setStats({
          categories: categories.length,
          packages: packages.length,
          tours: tours.length,
          activeTours: tours.filter((t) => t.status === "active").length,
        });
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 md:p-8 lg:p-10 space-y-10 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text">
            Dashboard
          </h1>
          <p className="text-text-secondary mt-2">
            Welcome back • Overview of Royal Challengers platform
          </p>
        </div>

        <div className="text-sm text-text-secondary font-medium">
          {new Date().toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<MdCategory size={28} />}
          title="Categories"
          value={stats.categories}
          color="bg-primary-100 text-primary-800"
          loading={loading}
        />

        <StatCard
          icon={<MdCardTravel size={28} />}
          title="Packages"
          value={stats.packages}
          color="bg-accent-100 text-accent-800"
          loading={loading}
        />

        <StatCard
          icon={<MdTour size={28} />}
          title="Total Tours"
          value={stats.tours}
          color="bg-primary-50 text-primary-700"
          loading={loading}
        />

        <StatCard
          icon={<MdLocalActivity size={28} />}
          title="Active Tours"
          value={stats.activeTours}
          color="bg-accent-50 text-accent-700"
          loading={loading}
        />
      </div>

      {/* Coming Soon / Analytics Teaser */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-text mb-4">
            Bookings Overview
          </h2>
          <div className="h-64 bg-surface/50 rounded-xl flex items-center justify-center border border-border">
            <div className="text-center space-y-3">
              <p className="text-lg font-medium text-text-secondary">
                Analytics & Revenue Charts
              </p>
              <p className="text-sm text-text-secondary">
                Coming soon — track your growth in real-time
              </p>
            </div>
          </div>
        </div>

        <div className="card p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-text mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-surface/60 rounded-lg animate-pulse"
              />
            ))}
          </div>
          <p className="text-sm text-text-secondary mt-6 text-center">
            Activity log & notifications — coming soon
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================= STAT CARD COMPONENT ================= */

function StatCard({ icon, title, value, color, loading }) {
  return (
    <div className="card p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-8 w-24 bg-surface/70 rounded" />
          <div className="h-10 w-16 bg-surface/70 rounded" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-text-secondary">
                {title}
              </p>
              <h3 className="text-3xl font-bold text-text">{value}</h3>
            </div>

            <div
              className={`p-3 rounded-xl ${color} bg-opacity-30 backdrop-blur-sm`}
            >
              {icon}
            </div>
          </div>

          <div className="mt-4 h-1.5 w-full bg-surface/50 rounded-full overflow-hidden">
            <div
              className={`h-full ${color.replace("text", "bg")} transition-all duration-1000`}
              style={{ width: `${Math.min(value * 5, 100)}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}