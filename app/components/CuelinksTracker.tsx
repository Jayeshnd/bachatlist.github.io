"use client";

import { useState } from "react";
import Link from "next/link";

interface CuelinksTrackerProps {
  campaignId: string | number;
  dealId?: string;
  redirectUrl: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function CuelinksTracker({
  campaignId,
  dealId,
  redirectUrl,
  children,
  className = "",
  onClick,
}: CuelinksTrackerProps) {
  const [isTracking, setIsTracking] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    // Call custom onClick if provided
    if (onClick) {
      onClick();
    }

    // Don't interfere with modifier keys or new tab clicks
    if (e.ctrlKey || e.metaKey || e.button !== 0) {
      return;
    }

    e.preventDefault();
    setIsTracking(true);

    try {
      console.log("[CuelinksTracker] Tracking click:", { campaignId, dealId, redirectUrl });

      const response = await fetch("/api/cuelinks/click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaign_id: Number(campaignId),
          sub_id_1: dealId,
          sub_id_2: "website",
          redirect_url: redirectUrl,
        }),
      });

      const data = await response.json();
      console.log("[CuelinksTracker] Response:", data);

      if (data.url) {
        // Redirect to the tracked URL
        window.location.href = data.url;
      } else if (data.fallback_url) {
        // Use fallback URL if tracking failed
        window.location.href = data.fallback_url;
      } else {
        // Fallback to original URL
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error("[CuelinksTracker] Error tracking click:", error);
      // Fallback: open original URL
      window.open(redirectUrl, "_blank");
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <a
      href={redirectUrl}
      onClick={handleClick}
      className={`${className} ${isTracking ? "pointer-events-none opacity-70" : ""}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {isTracking && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
      {children}
    </a>
  );
}

// Simple click-through component that just tracks the click and redirects
export function TrackableLink({
  url,
  dealId,
  campaignId,
  children,
  className = "",
}: {
  url: string;
  dealId?: string;
  campaignId?: string | number;
  children: React.ReactNode;
  className?: string;
}) {
  const handleClick = async () => {
    try {
      // Fire and forget - don't wait for response
      if (campaignId) {
        fetch("/api/cuelinks/click", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            campaign_id: Number(campaignId),
            sub_id_1: dealId,
            sub_id_2: "website",
            redirect_url: url,
          }),
        }).catch(console.error);
      }

      // Also track in our database
      if (dealId) {
        fetch(`/api/admin/deals/${dealId}/click`, {
          method: "POST",
        }).catch(console.error);
      }
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  };

  return (
    <Link
      href={url}
      onClick={handleClick}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  );
}

// Button version
export function TrackableButton({
  onClick,
  children,
  className = "",
  disabled = false,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick();
    }

    // Track click if it was for a deal
    const dealId = (e.currentTarget as HTMLButtonElement).dataset.dealId;
    const campaignId = (e.currentTarget as HTMLButtonElement).dataset.campaignId;

    if (dealId || campaignId) {
      try {
        fetch("/api/cuelinks/click", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            campaign_id: Number(campaignId || 0),
            sub_id_1: dealId,
            sub_id_2: "website",
            redirect_url: "",
          }),
        }).catch(console.error);
      } catch (error) {
        console.error("Error tracking click:", error);
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
