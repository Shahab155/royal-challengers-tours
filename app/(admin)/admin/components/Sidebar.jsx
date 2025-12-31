// app/admin/components/Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
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
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";

const SIDEBAR_WIDTH = "18rem"; // w-72

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const menu = [
    { name: "Dashboard", href: "/admin/dashboard", icon: MdDashboard },
    { name: "Packages", href: "/admin/packages", icon: MdOutlineInventory2 },
    { name: "Tours", href: "/admin/tours", icon: MdOutlineMap },
    { name: "Bookings", href: "/admin/bookings", icon: MdOutlineEventAvailable },
    { name: "Categories", href: "/admin/categories", icon: MdOutlineCategory },
    { name: "Inquiries", href: "/admin/contact-queries", icon: MdOutlineMessage },
  ];

  const isActive = (href) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 left-5 z-[100] lg:hidden p-3.5 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 text-gray-800 dark:text-white transition-all active:scale-95"
        aria-label="Toggle menu"
      >
        {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
      </button>

      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-md z-[90] transition-all duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-[80] h-screen w-[${SIDEBAR_WIDTH}]
          bg-white/80 dark:bg-gray-900/90 backdrop-blur-2xl
          border-r border-gray-200/50 dark:border-gray-800/60
          shadow-2xl
          flex flex-col
          transition-all duration-500 ease-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo Section */}
        <div className="px-8 py-10 border-b border-gray-200/30 dark:border-gray-800/40">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Royal Challengers
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
            Luxury Travel Admin
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {menu.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  group relative flex items-center gap-4 px-6 py-4 rounded-2xl font-medium text-lg
                  transition-all duration-300 overflow-hidden
                  ${
                    active
                      ? "text-white shadow-2xl"
                      : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }
                `}
              >
                {/* Active Background Gradient */}
                <div
                  className={`
                    absolute inset-0 rounded-2xl transition-all duration-500
                    ${active 
                      ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-100 scale-100" 
                      : "bg-gray-100/50 dark:bg-gray-800/50 opacity-0 scale-95"
                    }
                  `}
                />

                {/* Glow Effect on Active */}
                {active && (
                  <div className="absolute inset-0 rounded-2xl shadow-lg shadow-purple-500/30 animate-pulse" />
                )}

                {/* Icon */}
                <Icon
                  size={26}
                  className={`
                    relative z-10 transition-colors duration-300
                    ${active ? "text-white drop-shadow-md" : "group-hover:text-indigo-600 dark:group-hover:text-purple-400"}
                  `}
                />

                {/* Label */}
                <span className="relative z-10">{item.name}</span>

                {/* Hover Shine Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-6 py-8 border-t border-gray-200/30 dark:border-gray-800/40">
          <button
            onClick={async () => {
              await signOut({ redirect: false });
              router.replace("/login");
            }}
            className="
              w-full flex items-center gap-4 px-6 py-4 rounded-2xl
              text-red-600 dark:text-red-400 font-medium text-lg
              hover:bg-red-50 dark:hover:bg-red-900/30
              hover:shadow-lg hover:shadow-red-500/20
              transition-all duration-300 group
            "
          >
            <FiLogOut size={26} className="group-hover:scale-110 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}