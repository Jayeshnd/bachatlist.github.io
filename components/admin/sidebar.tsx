"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/deals", label: "Deals", icon: "💰" },
  { href: "/admin/categories", label: "Categories", icon: "📁" },
  { href: "/admin/affiliate", label: "Affiliate Networks", icon: "🔗" },
  { href: "/admin/analytics", label: "Analytics", icon: "📈" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <Link href="/admin" className="flex items-center space-x-2">
          <span className="text-3xl">💰</span>
          <span className="text-xl font-bold">BachatList</span>
        </Link>
        <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition"
        >
          <span className="text-xl">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
