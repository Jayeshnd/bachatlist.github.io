"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/deals", label: "Deals", icon: "💰" },
  { href: "/admin/hot-deals", label: "Hot Deals", icon: "🔥" },
  { href: "/admin/coupons", label: "Coupons", icon: "🏷️" },
  { href: "/admin/categories", label: "Categories", icon: "📁" },
  { href: "/admin/banners", label: "Banners", icon: "🖼️" },
  { href: "/admin/pages", label: "Pages", icon: "📄" },
  { href: "/admin/blog", label: "Blog", icon: "📝" },
  { href: "/admin/features", label: "Features", icon: "✨" },
  { href: "/admin/affiliate", label: "Affiliate Networks", icon: "🔗" },
  { href: "/admin/analytics", label: "Analytics", icon: "📈" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

const publicPages = [
  { href: "/loot", label: "Loot Deals", icon: "🎁" },
  { href: "/blog", label: "Blog", icon: "📝" },
  { href: "/features", label: "Features", icon: "✨" },
  { href: "/about", label: "About Us", icon: "👥" },
  { href: "/telegram", label: "Telegram Channel", icon: "📱" },
  { href: "/coupon", label: "Coupon", icon: "🏷️" },
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

        <div className="my-4 border-t border-gray-700"></div>

        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Public Pages
        </p>

        {publicPages.map((item) => {
          const isActive = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
              <span className="ml-auto text-xs">↗</span>
            </a>
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
