import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
  asLink?: boolean;
}

export default function Logo({ size = "lg", showTagline = false, className = "", asLink = false }: LogoProps): React.ReactNode {
  const sizeClasses: Record<string, string> = {
    sm: "h-8 w-16",
    md: "h-10 w-20",
    lg: "h-12 w-24",
    xl: "h-14 w-28",
  };

  const logoClasses = sizeClasses[size] || sizeClasses.lg;

  // Logo content with new SVG from public folder
  const logoContent = (
    <div className={`flex items-center ${className}`}>
      {/* New Professional Logo SVG */}
      <img
        src="/logo.svg"
        alt="BachatList Logo"
        className={`${logoClasses}`}
      />
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
