// components/mapa/LocationMap.tsx

"use client";

import React, { useEffect, useRef } from "react";
import L, { Map as LeafletMap, Marker, Icon } from "leaflet";

type Location = { lat: number; lng: number };

type Props = {
  paladarLocation: Location;
  userLocation: Location | null;
};

export default function LocationMap({
  paladarLocation,
  userLocation,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap>();
  const paladarMarkerRef = useRef<Marker>();
  const userMarkerRef = useRef<Marker>();
  const didInitialFitRef = useRef(false);

  const paladarIcon = new Icon({
    iconUrl: "/icons/marcador.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -38],
  });

  const userIcon = new Icon({
    iconUrl: "/icons/Persona.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
  });

  // 1) Inicializar mapa y marcador fijo de la paladar
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView(
      [paladarLocation.lat, paladarLocation.lng],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    paladarMarkerRef.current = L.marker(
      [paladarLocation.lat, paladarLocation.lng],
      { icon: paladarIcon }
    )
      .addTo(map)
      .bindTooltip("La Loma", {
        permanent: true,
        direction: "right",
        offset: [10, 0],
        className: "text-sm font-bold bg-white bg-opacity-75 px-1 rounded",
      });

    mapRef.current = map;
  }, [paladarLocation, paladarIcon]);

  // 2) Al cambiar userLocation, crea/mueve marcador y realiza el fit inicial una sola vez
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation) return;

    const { lat, lng } = userLocation;

    // crear o mover marcador del usuario
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([lat, lng]);
    } else {
      userMarkerRef.current = L.marker([lat, lng], { icon: userIcon })
        .addTo(map)
        .bindTooltip("Tú estás aquí", {
          permanent: true,
          direction: "top",
          offset: [0, -32],
          className: "text-sm font-bold bg-white bg-opacity-75 px-1 rounded",
        })
        .openPopup();
    }

    // ajustar vista sólo la primera vez que llega userLocation
    if (!didInitialFitRef.current) {
      const bounds = L.latLngBounds([
        [paladarLocation.lat, paladarLocation.lng],
        [lat, lng],
      ]);
      map.fitBounds(bounds.pad(0.2));
      didInitialFitRef.current = true;
    }
  }, [userLocation, paladarLocation, userIcon]);

  return (
    <div
      ref={containerRef}
      className="h-[400px] w-full rounded-lg shadow-lg"
    />
  );
}
