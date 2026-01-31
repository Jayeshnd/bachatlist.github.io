import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
}

export default function Logo({ size = "md", showTagline = false }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-14 h-14",
  };

  // Modern shield icon with B letter
  const shieldIcon = (
    <svg
      className={iconSizes[size]}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Blue shield background */}
      <path
        d="M32 4L56 14V30C56 46 44 58 32 60C20 58 8 46 8 30V14L32 4Z"
        fill="url(#shieldGradient)"
      />
      {/* White shield inner */}
      <path
        d="M32 10L50 17V27C50 40 41 51 32 53C23 51 14 40 14 27V17L32 10Z"
        fill="white"
      />
      {/* Letter B */}
      <text
        x="32"
        y="38"
        textAnchor="middle"
        fontSize="20"
        fontWeight="bold"
        fill="#1D4ED8"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        B
      </text>
      <defs>
        <linearGradient id="shieldGradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <Link href="/" className="flex items-center gap-2 group">
      {/* Logo Icon */}
      <div className="flex-shrink-0 transform group-hover:scale-105 transition-transform duration-300">
        {shieldIcon}
      </div>
      
      {/* Logo Text */}
      <div className="flex flex-col">
        <span className={`${sizeClasses[size]} font-bold tracking-tight leading-none font-sans text-slate-800`}>
          bachatlist
        </span>
        {showTagline && (
          <span className="text-[9px] text-slate-500 font-medium tracking-wider uppercase">
            Best Deals & Smart Shopping
          </span>
        )}
      </div>
    </Link>
  );
}
