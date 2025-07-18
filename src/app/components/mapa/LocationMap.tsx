// components/mapa/LocationMap.tsx

"use client";

import React, { useEffect, useRef } from "react";
import L, { Map as LeafletMap, Marker, Icon } from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

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

  // 1) Inicializa el mapa y el marcador fijo del paladar
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

  // 2) Cuando cambie userLocation, actualiza marcador, ajusta vista y dibuja ruta
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation) return;

    const { lat, lng } = userLocation;

    // 2.1) Crear o mover marcador del usuario
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

    // 2.2) Ajustar vista al inicio para incluir ambos puntos (solo una vez)
    if (!didInitialFitRef.current) {
      const bounds = L.latLngBounds(
        [
          [paladarLocation.lat, paladarLocation.lng],
          [lat, lng],
        ]
      );
      map.fitBounds(bounds.pad(0.2));
      didInitialFitRef.current = true;
    }

    // 2.3) Limpiar control de ruteo anterior
    const prevControl = (map as any)._routingControl;
    if (prevControl) {
      prevControl.remove();
    }

    // 2.4) Crear y añadir nuevo control de ruteo
    const routingControl = (L as any).Routing.control({
      waypoints: [
        L.latLng(lat, lng),
        L.latLng(paladarLocation.lat, paladarLocation.lng),
      ],
      lineOptions: {
        styles: [{ color: "#3b82f6", weight: 5, opacity: 0.7 }],
      },
      show: false,            // oculta la UI del plugin
      addWaypoints: false,    // no permite arrastrar waypoints
      routeWhileDragging: false,
      createMarker: () => null // usamos nuestros propios marcadores
    }).addTo(map);

    // 2.5) Guardar referencia para posteriores limpiezas
    (map as any)._routingControl = routingControl;
  }, [userLocation, paladarLocation, userIcon]);

  return (
    <div
      ref={containerRef}
      className="h-[400px] w-full rounded-lg shadow-lg"
    />
  );
}
