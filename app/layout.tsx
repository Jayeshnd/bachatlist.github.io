import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";

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
      <body>
        <Header />
        <main>
          <Providers>{children}</Providers>
        </main>
        <Footer />
      </body>
    </html>
  );
}
