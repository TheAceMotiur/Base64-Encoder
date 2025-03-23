"use client";

import { useEffect, useRef } from "react";

interface AdSenseProps {
  adClient: string;
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function AdSense({
  adClient,
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  style = { display: "block" },
  className = "",
}: AdSenseProps) {
  // Fix: Change HTMLModElement to HTMLElement which is more appropriate for <ins> tag
  const adRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      // Check if window and adsbygoogle exist
      if (typeof window !== "undefined") {
        // Ensure adsbygoogle array exists
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
    />
  );
}
