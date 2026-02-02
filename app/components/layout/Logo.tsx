import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
  asLink?: boolean;
  darkMode?: boolean; // For dark backgrounds
}

export default function Logo({ size = "lg", showTagline = false, className = "", asLink = false, darkMode = false }: LogoProps): React.ReactNode {
  const sizeClasses: Record<string, string> = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
    xl: "h-14",
  };

  const logoClasses = sizeClasses[size] || sizeClasses.lg;

  // Logo content with adaptive colors
  const logoContent = (
    <div className={`flex items-center ${className}`}>
      {/* Logo SVG with adaptive colors */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 80"
        width="300"
        height="80"
        fill="none"
        className={logoClasses}
        style={darkMode ? { filter: "brightness(0.95)" } : {}}
      >
        <g transform="translate(15, 12)">
          <path
            d="M15 50 C 10 50, 5 55, 10 60 C 15 65, 25 65, 30 55 C 35 45, 45 65, 50 60 C 55 55, 50 50, 45 50"
            stroke={darkMode ? "#fbbf24" : "#ca8a04"}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path d="M30 55 Q 30 45 30 35" stroke={darkMode ? "#4ade80" : "#16a34a"} strokeWidth="3" strokeLinecap="round" />
          <path d="M30 45 Q 20 45 15 35 Q 20 25 30 35" fill={darkMode ? "#4ade80" : "#16a34a"} />
          <path d="M30 42 Q 40 42 45 32 Q 40 22 30 32" fill={darkMode ? "#4ade80" : "#16a34a"} />
          <path d="M10 30 Q 30 15 50 10" stroke={darkMode ? "#fbbf24" : "#ca8a04"} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M42 10 L 50 10 L 48 18" stroke={darkMode ? "#fbbf24" : "#ca8a04"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
        <text x="75" y="52" fontFamily="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" fontWeight="700" fontSize="32">
          <tspan fill={darkMode ? "#ffffff" : "#1f2937"}>Bachat</tspan>
          <tspan fill={darkMode ? "#4ade80" : "#16a34a"}>List</tspan>
          <tspan fill={darkMode ? "#ffffff" : "#1f2937"} fontSize="24" fontWeight="400">.com</tspan>
        </text>
      </svg>
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
