"use client";

import { useState, useEffect } from "react";

interface LocationLinkProps {
  coordinates: string;
  locationName: string;
}

export default function LocationLink({ coordinates, locationName }: LocationLinkProps) {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Определяем платформу пользователя
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
  }, []);

  const handleOpenMap = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!coordinates) return;

    const [lat, lng] = coordinates
      .split(",")
      .map((coord) => parseFloat(coord.trim()));

    if (isNaN(lat) || isNaN(lng)) return;

    let mapUrl;
    if (isIOS) {
      // Apple Maps URL format
      mapUrl = `https://maps.apple.com/?q=${locationName}&ll=${lat},${lng}`;
    } else {
      // Google Maps URL format
      mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    }

    window.open(mapUrl, "_blank");
  };

  return (
    <button
      onClick={handleOpenMap}
      className="inline-flex items-center underline cursor-pointer w-fit"
      aria-label={`View location on map: ${locationName}`}
    >
      <svg className="w-4 h-4 mr-1 text-zone-gold-lite" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
          clipRule="evenodd"
        />
      </svg>
      <span>{locationName}</span>
    </button>
  );
}