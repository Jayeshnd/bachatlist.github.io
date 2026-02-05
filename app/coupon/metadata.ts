import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Coupons & Promo Codes | BachatList",
    template: "%s Coupons | BachatList",
  },
  description: "Find the latest coupons and promo codes for top brands. Save money on every purchase with verified discount codes.",
  keywords: ["coupons", "promo codes", "discount codes", "deals", "savings", "offers", "discounts"],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Coupons & Promo Codes | BachatList",
    description: "Find the latest coupons and promo codes for top brands. Save money on every purchase.",
    type: "website",
    siteName: "BachatList",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coupons & Promo Codes | BachatList",
    description: "Find the latest coupons and promo codes for top brands.",
  },
};
