import React from "react";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
  asLink?: boolean;
  darkMode?: boolean;
}

export default function Logo({ size = "lg", showTagline = false, className = "", asLink = false, darkMode }: LogoProps): React.ReactNode {
  const sizeClasses: Record<string, string> = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
    xl: "h-14",
  };

  const logoClasses = sizeClasses[size] || sizeClasses.lg;

  // Use a simple text-based logo to avoid hydration issues
  const logoContent = (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`${logoClasses} font-bold text-green-600`}>
        💰
      </span>
      <span className={`${logoClasses === "h-8" ? "text-lg" : logoClasses === "h-10" ? "text-xl" : logoClasses === "h-12" ? "text-2xl" : "text-3xl"} font-bold text-gray-900 dark:text-white`}>
        Bachat<span className="text-green-600 dark:text-green-400">List</span>
      </span>
    </div>
  );

  if (asLink) {
    return (
      <a href="/" aria-label="BachatList Home" className="inline-block">
        {logoContent}
      </a>
    );
  }

  return logoContent;
}
