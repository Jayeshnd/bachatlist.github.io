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
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
  };

  // SVG for the leaf/saver icon from your logo
  const leafIcon = (
    <svg
      className={iconSizes[size]}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer leaf shape */}
      <path
        d="M50 5C25 5 5 30 5 55C5 80 25 95 50 95C75 95 95 80 95 55C95 30 75 5 50 5Z"
        fill="#22C55E"
      />
      {/* Inner leaf detail */}
      <path
        d="M50 15C30 15 15 35 15 55C15 75 30 85 50 85C70 85 85 75 85 55C85 35 70 15 50 15Z"
        fill="#16A34A"
      />
      {/* Dollar/Saver symbol */}
      <text
        x="50"
        y="58"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="28"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        $
      </text>
    </svg>
  );

  return (
    <Link href="/" className="flex items-center gap-3">
      {/* Logo Icon */}
      <div className="flex-shrink-0">
        {leafIcon}
      </div>
      
      {/* Logo Text */}
      <div className="flex flex-col">
        <span className={`${sizeClasses[size]} font-bold tracking-tight leading-none`}>
          <span className="text-green-600">BACHAT</span>
          <span className="text-gray-900">LIST</span>
        </span>
        {showTagline && (
          <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">
            India's Biggest Saving Community
          </span>
        )}
      </div>
    </Link>
  );
}
