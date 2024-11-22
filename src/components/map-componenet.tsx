"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaLocationPin } from "react-icons/fa6";
import { renderToString } from "react-dom/server";

interface MapComponentProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  onMapClick: (lat: number, lng: number) => void;
}

export default function Component({
  latitude,
  longitude,
  zoom = 13,
  onMapClick,
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([latitude, longitude], zoom);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);

      setMapReady(true);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    const iconHtml = renderToString(
      <FaLocationPin size={32} color="#FF0000" />
    );
    const customIcon = L.divIcon({
      html: iconHtml,
      className: "custom-pin-icon",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
    } else {
      markerRef.current = L.marker([latitude, longitude], {
        icon: customIcon,
      }).addTo(mapRef.current);
    }

    mapRef.current.setView([latitude, longitude], zoom);

    const clickHandler = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }
    };

    mapRef.current.on("click", clickHandler);

    return () => {
      if (mapRef.current) {
        mapRef.current.off("click", clickHandler);
      }
    };
  }, [latitude, longitude, zoom, onMapClick, mapReady]);

  return (
    <div
      id="map"
      className="h-[400px] w-full rounded-md"
      aria-label="Map showing specified location"
    />
  );
}
