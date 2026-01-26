import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BachatList - Best Deals & Smart Shopping",
  description: "Find the best deals and save more on every purchase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
