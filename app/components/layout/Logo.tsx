import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
  asLink?: boolean;
  darkMode?: boolean;
}

const sizeMap = {
  sm: { width: 120, height: 32 },
  md: { width: 150, height: 40 },
  lg: { width: 200, height: 53 },
  xl: { width: 250, height: 67 },
};

export default function Logo({ size = "lg", showTagline = false, className = "", asLink = false, darkMode }: LogoProps): React.ReactNode {
  const dimensions = sizeMap[size] || sizeMap.lg;

  const logoContent = (
    <div className={`flex items-center ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 80"
        width={dimensions.width}
        height={dimensions.height}
        fill="none"
      >
        <g transform="translate(15, 12)">
          <path
            d="M15 50 C 10 50, 5 55, 10 60 C 15 65, 25 65, 30 55 C 35 45, 45 65, 50 60 C 55 55, 50 50, 45 50"
            stroke="#fbbf24"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path d="M30 55 Q 30 45 30 35" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
          <path d="M30 45 Q 20 45 15 35 Q 20 25 30 35" fill="#4ade80" />
          <path d="M30 42 Q 40 42 45 32 Q 40 22 30 32" fill="#4ade80" />
          <path d="M10 30 Q 30 15 50 10" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M42 10 L 50 10 L 48 18" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
        <text x="75" y="52" fontFamily="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" fontWeight="700" fontSize="32">
          <tspan fill="#fbbf24">Bachat</tspan>
          <tspan fill="#4ade80">List</tspan>
          <tspan fill="#fbbf24" fontSize="24" fontWeight="400">.com</tspan>
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
