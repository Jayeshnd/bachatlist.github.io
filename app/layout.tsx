import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import LayoutWrapper from "@/app/components/LayoutWrapper";

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "BachatList - Best Deals & Smart Shopping",
    template: "%s | BachatList",
  },
  description: "Find the best deals and save more on every purchase. Discover coupons, discounts, and exclusive offers across top brands and categories.",
  keywords: ["deals", "coupons", "discounts", "savings", "best prices", "shopping", "offers", "bargains", "India"],
  authors: [{ name: "BachatList" }],
  creator: "BachatList",
  publisher: "BachatList",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://bachatlist.com",
    siteName: "BachatList",
    title: "BachatList - Best Deals & Smart Shopping",
    description: "Find the best deals and save more on every purchase. Discover coupons, discounts, and exclusive offers.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BachatList - Best Deals & Smart Shopping",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bachatlist",
    creator: "@bachatlist",
    title: "BachatList - Best Deals & Smart Shopping",
    description: "Find the best deals and save more on every purchase.",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://bachatlist.com",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "BachatList",
              url: "https://bachatlist.com",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://bachatlist.com/deals?search={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body>
        <LayoutWrapper>
          <Providers>{children}</Providers>
        </LayoutWrapper>
      </body>
    </html>
  );
}
