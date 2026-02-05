"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Logo from "./Logo";

const navItems = [
  { name: "Deals", href: "/deals" },
  { name: "Categories", href: "/categories" },
  { name: "Coupon", href: "/coupon" },
  { name: "Blog", href: "/blog" },
  { name: "Telegram", href: "/telegram" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="BachatList Home">
            <Logo size="md" />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-primary font-medium transition duration-200"
                aria-label={item.name}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            {mounted && session ? (
              <>
                <span suppressHydrationWarning className="text-gray-600 font-medium">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium transition duration-200"
                  aria-label="Sign out"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition duration-200"
                aria-label="Login to your account"
              >
                Login
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-primary transition duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
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
          <nav className="md:hidden mt-4 pb-4 border-t pt-4 space-y-3" role="navigation" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-gray-600 hover:text-primary font-medium transition duration-200"
                onClick={() => setMobileMenuOpen(false)}
                aria-label={item.name}
              >
                {item.name}
              </Link>
            ))}
            {mounted && session ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="block w-full text-left py-2 text-gray-600 hover:text-primary font-medium transition duration-200"
                aria-label="Sign out"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="block py-2 text-gray-600 hover:text-primary font-medium transition duration-200"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Login to your account"
              >
                Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
