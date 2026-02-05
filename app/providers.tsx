"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col">{children}</div>
    </SessionProvider>
  );
}
