"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to root login page to avoid showing admin sidebar
    router.push("/login");
  }, [router]);

  return null; // This page redirects, so nothing to render
}
