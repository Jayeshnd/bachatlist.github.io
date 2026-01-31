"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";

const navItems = [
  { name: "Deals", href: "/deals" },
  { name: "Loot", href: "/loot", badge: "HOT" },
  { name: "Coupon", href: "/coupon" },
  { name: "Blog", href: "/blog" },
  { name: "Features", href: "/features" },
  { name: "Telegram", href: "/telegram" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Logo size="md" />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative text-gray-600 hover:text-primary font-medium transition ${
                  item.badge === "HOT" ? "text-red-500" : ""
                }`}
              >
                {item.name}
                {item.badge && (
                  <span className="absolute -top-5 -right-5 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-primary font-medium">
              Login
            </Link>
            <Link
              href="/deals/create"
              className="bg-gradient-to-r from-primary to-primary/90 text-white px-5 py-2 rounded-lg font-medium hover:opacity-90 transition shadow-lg shadow-primary/25"
            >
              Add Deal
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-2 text-gray-600 hover:text-primary font-medium ${
                  item.badge === "HOT" ? "text-red-500" : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
                {item.badge && (
                  <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
            <div className="pt-4 space-y-3">
              <Link
                href="/login"
                className="block text-gray-600 hover:text-primary font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/deals/create"
                className="block bg-gradient-to-r from-primary to-primary/90 text-white px-5 py-2 rounded-lg font-medium text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Add Deal
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
