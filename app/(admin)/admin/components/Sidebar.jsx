"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  MdDashboard,
  MdOutlineInventory2,
  MdOutlineMap,
  MdOutlineEventAvailable,
  MdOutlineCategory,
  MdOutlineMessage,
} from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    { name: "Dashboard", href: "/admin/dashboard", icon: MdDashboard },
    { name: "Packages", href: "/admin/packages", icon: MdOutlineInventory2 },
    { name: "Tours", href: "/admin/tours", icon: MdOutlineMap },
    { name: "Bookings", href: "/admin/bookings", icon: MdOutlineEventAvailable },
    { name: "Categories", href: "/admin/categories", icon: MdOutlineCategory },
    { name: "Contact Inquiries", href: "/admin/contact-queries", icon: MdOutlineMessage },
  ];

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="w-72 min-h-screen bg-gradient-to-b from-primary-600 to-primary-700 text-white flex flex-col shadow-2xl shadow-primary-900/40 relative">
      {/* Brand / Logo area */}
      <div className="px-6 py-8 border-b border-primary-400/30">
        <h2
          className="text-3xl font-heading tracking-wider"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Royal Challengers
        </h2>
        <p className="text-sm text-primary-200 mt-1 font-light opacity-90">
          Luxury Travel Admin
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-10 space-y-1.5">
        {menu.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group flex items-center gap-3.5 px-5 py-3.5 rounded-xl font-medium transition-all duration-300 ease-out
                ${
                  active
                    ? "bg-accent-500/90 text-white shadow-lg shadow-accent-600/40 scale-[1.02]"
                    : "text-primary-100/90 hover:bg-primary-500/40 hover:text-accent-200 hover:translate-x-1.5"
                }
              `}
            >
              <Icon
                size={22}
                className={active ? "text-white" : "text-primary-200 group-hover:text-accent-300 transition-colors"}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout - more prominent */}
      <div className="px-4 py-6 border-t border-primary-400/30 mt-auto">
        <button
          onClick={async () => {
            await signOut({ redirect: false });
            router.replace("/login");
          }}
          className="
            w-full flex items-center gap-3.5 px-5 py-3.5 rounded-xl font-medium
            text-accent-200 hover:bg-accent-600/20 hover:text-accent-100
            transition-all duration-300
          "
        >
          <FiLogOut size={22} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}