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
  const adRef = useRef<HTMLModElement>(null);
  const isAdInitialized = useRef<boolean>(false);

  useEffect(() => {
    // Only run this on the client side
    if (typeof window === "undefined") return;
    
    // Don't initialize multiple times
    if (isAdInitialized.current) return;

    try {
      // Add a safety check for adsbygoogle
      if (window.adsbygoogle === undefined) {
        window.adsbygoogle = [];
      }
      
      // Mark as initialized to prevent multiple pushes
      if (adRef.current) {
        isAdInitialized.current = true;
        
        const adPushTimeout = setTimeout(() => {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (error) {
            console.warn("AdSense push failed:", error);
          }
        }, 300);
        
        return () => clearTimeout(adPushTimeout);
      }
    } catch (error) {
      console.warn("AdSense initialization error:", error);
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
