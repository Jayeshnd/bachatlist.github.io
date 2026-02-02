import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Deals & Discounts | BachatList",
    template: "%s | BachatList Deals",
  },
  description: "Find the best deals and discounts on products across various categories. Save money on every purchase with BachatList.",
  keywords: ["deals", "discounts", "coupons", "offers", "savings", "best prices"],
  openGraph: {
    title: "Deals & Discounts | BachatList",
    description: "Find the best deals and discounts on products across various categories. Save money on every purchase with BachatList.",
    type: "website",
    siteName: "BachatList",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deals & Discounts | BachatList",
    description: "Find the best deals and discounts on products across various categories.",
  },
  robots: {
    index: true,
    follow: true,
  },
};
