"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Динамически импортируем LocationLink с отключенным SSR
const LocationLink = dynamic(
  () => import('@/components/home/LocationLink'),
  { ssr: false }
);

interface ClientLocationLinkProps {
  coordinates: string;
  locationName: string;
}

// Компонент-обертка для LocationLink
export default function ClientLocationLink({ coordinates, locationName }: ClientLocationLinkProps) {
  return (
    <LocationLink coordinates={coordinates} locationName={locationName} />
  );
}