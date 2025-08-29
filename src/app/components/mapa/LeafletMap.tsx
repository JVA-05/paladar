// app/components/mapa/LocationMap.tsx
"use client";

import React, { useEffect, useRef } from "react";
import L, { Map as LeafletMap, Marker, Icon } from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet/dist/leaflet.css";

type Location = { lat: number; lng: number };
type Props = { paladarLocation: Location; userLocation: Location | null };

export default function LocationMap({ paladarLocation, userLocation }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap>();
  const paladarMarkerRef = useRef<Marker>();
  const userMarkerRef = useRef<Marker>();
  const didInitialFitRef = useRef(false);

  const paladarIcon = new Icon({
    iconUrl: "/icons/marcador.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  const userIcon = new Icon({
    iconUrl: "/icons/Persona.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  // Inicialización inicial del mapa
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
        className: "text-sm font-bold bg-white bg-opacity-75 px-1 rounded",
      });

    // fuerza recálculo de tamaño
    setTimeout(() => map.invalidateSize(), 0);

    mapRef.current = map;
  }, [paladarLocation, paladarIcon]);

  // Actualización al cambiar userLocation
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation) return;
    const { lat, lng } = userLocation;

    // mueve o crea marcador del usuario
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([lat, lng]);
    } else {
      userMarkerRef.current = L.marker([lat, lng], { icon: userIcon })
        .addTo(map)
        .bindTooltip("Tú estás aquí", {
          permanent: true,
          direction: "top",
          className: "text-sm font-bold bg-white bg-opacity-75 px-1 rounded",
        })
        .openPopup();
    }

    // ajusta vista la primera vez
    if (!didInitialFitRef.current) {
      map.fitBounds(
        L.latLngBounds(
          [
            [paladarLocation.lat, paladarLocation.lng],
            [lat, lng],
          ]
        ).pad(0.2)
      );
      didInitialFitRef.current = true;
    }

    // limpia y crea nuevo control de ruteo
    const prev = (map as any)._routingControl;
    if (prev) prev.remove();

    const routingControl = (L as any).Routing.control({
      waypoints: [
        L.latLng(lat, lng),
        L.latLng(paladarLocation.lat, paladarLocation.lng),
      ],
      lineOptions: { styles: [{ color: "#3b82f6", weight: 5, opacity: 0.7 }] },
      show: false,
      addWaypoints: false,
      createMarker: () => null,
    }).addTo(map);

    (map as any)._routingControl = routingControl;
  }, [userLocation, paladarLocation, userIcon]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-lg shadow-lg"
      style={{ minHeight: 300 }}
    />
  );
}
