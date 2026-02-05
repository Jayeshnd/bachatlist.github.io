"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import Logo from "@/app/components/layout/Logo";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link href="/">
            <Logo size="md" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 transition text-gray-700 hover:text-green-700"
              >
                <span className="text-xl">📊</span>
                <span className="font-medium">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/deals"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 transition text-gray-700 hover:text-green-700"
              >
                <span className="text-xl">🏷️</span>
                <span className="font-medium">Deals</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/banners"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 transition text-gray-700 hover:text-green-700"
              >
                <span className="text-xl">🖼️</span>
                <span className="font-medium">Banners</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/categories"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 transition text-gray-700 hover:text-green-700"
              >
                <span className="text-xl">📁</span>
                <span className="font-medium">Categories</span>
              </Link>
            </li>
            {/* Pages - Hidden for now */}
            <li>
              <Link
                href="/admin/blog"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 transition text-gray-700 hover:text-green-700"
              >
                <span className="text-xl">📝</span>
                <span className="font-medium">Blog</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/about"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 transition text-gray-700 hover:text-green-700"
              >
                <span className="text-xl">ℹ️</span>
                <span className="font-medium">About</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/contact"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 transition text-gray-700 hover:text-green-700"
              >
                <span className="text-xl">📞</span>
                <span className="font-medium">Contact</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/stores"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 transition text-gray-700 hover:text-green-700"
              >
                <span className="text-xl">🏪</span>
                <span className="font-medium">Stores</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/coupons"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 transition text-gray-700 hover:text-green-700"
              >
                <span className="text-xl">🎫</span>
                <span className="font-medium">Coupons</span>
              </Link>
            </li>
            <li className="pt-4 mt-4 border-t border-gray-100">
              <Link
                href="/admin/affiliate"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 transition text-gray-700 hover:text-green-700"
              >
                <span className="text-xl">🔗</span>
                <span className="font-medium">Affiliate</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/cuelinks"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 transition text-gray-700 hover:text-green-700"
              >
                <span className="text-xl">💰</span>
                <span className="font-medium">Cuelinks</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/analytics"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 transition text-gray-700 hover:text-green-700"
              >
                <span className="text-xl">📈</span>
                <span className="font-medium">Analytics</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 transition text-gray-700 hover:text-green-700"
              >
                <span className="text-xl">⚙️</span>
                <span className="font-medium">Settings</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition text-red-600 hover:text-red-700"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 transition text-gray-500 hover:text-green-700"
          >
            <span className="text-xl">🌐</span>
            <span className="font-medium">View Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}
