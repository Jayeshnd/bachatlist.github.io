// components/layout/Footer.tsx
"use client";

import Link from "next/link";
import Logo from "./Logo";
import { useState } from "react";

const quickLinks = [
  { name: "Deals", href: "/deals" },
  { name: "Categories", href: "/categories" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
];

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com/bachatlist", icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
  { name: "Twitter", href: "https://twitter.com/bachatlist", icon: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
  { name: "Instagram", href: "https://instagram.com/bachatlist", icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 2a2 2 0 100 4 2 2 0 000-4z" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-800 text-white py-8" role="contentinfo" suppressHydrationWarning>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <Link href="/" aria-label="BachatList Home">
              <Logo size="md" className="dark:text-white" />
            </Link>
            <p className="text-gray-400 mt-4">Your one-stop destination for coupons and discounts.</p>
            <div className="flex space-x-4 mt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="text-gray-400 hover:text-white transition duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <nav aria-label="Quick links">
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <nav aria-label="Categories">
              <ul className="space-y-2">
                <li><Link href="/categories" className="text-gray-400 hover:text-white transition duration-200">All Categories</Link></li>
                <li><Link href="/deals?category=food" className="text-gray-400 hover:text-white transition duration-200">Food & Dining</Link></li>
                <li><Link href="/deals?category=shopping" className="text-gray-400 hover:text-white transition duration-200">Shopping</Link></li>
                <li><Link href="/deals?category=travel" className="text-gray-400 hover:text-white transition duration-200">Travel</Link></li>
                <li><Link href="/deals?category=electronics" className="text-gray-400 hover:text-white transition duration-200">Electronics</Link></li>
              </ul>
            </nav>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter to get the latest deals.</p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-l-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Email address for newsletter"
                required
              />
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary/90 transition duration-200"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <p className="text-green-400 mt-2 text-sm" role="alert">
                ✓ Subscribed successfully!
              </p>
            )}
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-gray-500 pt-8 mt-8 border-t border-gray-700">
          <p>&copy; {new Date().getFullYear()} BachatList. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
