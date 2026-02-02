"use client";

import { usePathname } from "next/navigation";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/login";
  const isAuthRoute = pathname.startsWith("/api/auth");

  return (
    <>
      {!isAdminRoute && !isLoginRoute && !isAuthRoute && <Header />}
      {children}
      {!isAdminRoute && !isLoginRoute && !isAuthRoute && <Footer />}
    </>
  );
}
