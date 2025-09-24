import React, { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface FaviconProps {
  url: string;
  size?: number;
  className?: string;
  alt?: string;
}

export const Favicon: React.FC<FaviconProps> = ({
  url,
  size = 24,
  className = "",
  alt = "Favicon",
}) => {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!url) {
      setFaviconUrl(null);
      setIsLoading(false);
      return;
    }

    const getFaviconUrl = async () => {
      setIsLoading(true);
      try {
        // Normalize the URL
        const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
        const { hostname, origin } = new URL(normalizedUrl);

        // Try multiple favicon sources in order of preference
        const faviconSources = [
          // Try the website's own favicon first
          `${origin}/favicon.ico`,
          `${origin}/favicon.png`,
          // Fallback to external services
          `https://icons.duckduckgo.com/ip3/${hostname}.ico`,
          `https://www.google.com/s2/favicons?sz=${size}&domain=${encodeURIComponent(
            hostname
          )}`,
          `https://favicons.githubusercontent.com/${hostname}`,
        ];

        for (const faviconSrc of faviconSources) {
          try {
            // Test if the favicon exists by trying to load it
            const response = await fetch(faviconSrc, {
              method: "HEAD",
              mode: "no-cors", // Allow cross-origin requests
            });

            // For no-cors mode, we can't check the status, so we'll try to load the image
            const testImg = new Image();
            testImg.crossOrigin = "anonymous";

            const imageLoaded = await new Promise<boolean>((resolve) => {
              testImg.onload = () => resolve(true);
              testImg.onerror = () => resolve(false);
              testImg.src = faviconSrc;

              // Timeout after 2 seconds
              setTimeout(() => resolve(false), 2000);
            });

            if (imageLoaded) {
              setFaviconUrl(faviconSrc);
              setIsLoading(false);
              return;
            }
          } catch {
            // Continue to next source
            continue;
          }
        }

        // If all sources fail, use a fallback
        setFaviconUrl(
          `https://www.google.com/s2/favicons?sz=${size}&domain=${encodeURIComponent(
            hostname
          )}`
        );
      } catch {
        setFaviconUrl(null);
      }
      setIsLoading(false);
    };

    getFaviconUrl();
  }, [url, size]);

  if (isLoading) {
    return (
      <Skeleton
        className={`${className}`}
        style={{
          width: size,
          height: size,
          display: "inline-block",
          verticalAlign: "middle",
        }}
      />
    );
  }

  if (!faviconUrl) {
    // Return a default icon when no favicon is found
    return (
      <div
        className={`bg-gray-300 rounded flex items-center justify-center text-gray-600 ${className}`}
        style={{
          width: size,
          height: size,
          display: "inline-block",
          verticalAlign: "middle",
          fontSize: size * 0.6,
        }}
      >
        🌐
      </div>
    );
  }

  return (
    <img
      src={faviconUrl}
      width={size}
      height={size}
      className={className}
      alt={alt}
      style={{ display: "inline-block", verticalAlign: "middle" }}
      loading="lazy"
      onError={() => {
        // Fallback to default icon if image fails to load
        setFaviconUrl(null);
      }}
    />
  );
};
