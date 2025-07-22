"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import CTAButtons from "@/app/components/CTAButtons/CTAButtons";
import { useLocalStorage } from "@/hooks/useLocalStorage"; // asegúrate de importarlo

const LocationMap = dynamic(() => import("@/app/components/mapa/LocationMap"), {
  ssr: false,
});

export default function Home() {
  // 1. Slide actual y dirección del carrusel
  const [current, setCurrent] = useLocalStorage<number>("homeSlide", 0);
  const [dir, setDir]         = useState<"left" | "right">("right");

  // 2. Ubicación del usuario y seguimiento
  const [userLocation, setUserLocation] = useLocalStorage<{ lat: number; lng: number } | null>(
    "homeLocation",
    null
  );
  const [isWatching, setIsWatching] = useLocalStorage<boolean>("homeIsWatching", false);
  const [watchId, setWatchId]       = useState<number | null>(null);

  const slides = [
    { image: "/img/foto-principal/1.jpg", title: "Sabores de Cuba", subtitle: "Cocina tradicional con amor" },
    { image: "/img/foto-principal/2.jpg", title: "Ingredientes Frescos", subtitle: "Selección diaria de mercado" },
    { image: "/img/foto-principal/3.jpg", title: "Ambiente Único", subtitle: "La auténtica experiencia cubana" },
  ];

  // 3. Auto-rotación del carrusel
  useEffect(() => {
    const id = setInterval(() => {
      setDir("right");
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length, setCurrent]);

  const pos = (i: number) => {
    if (i === current) return "translate-x-0";
    if (dir === "right") return i > current ? "translate-x-full" : "-translate-x-full";
    return i < current ? "-translate-x-full" : "translate-x-full";
  };

  // 4. Activar o desactivar seguimiento de ubicación
  const handleLocate = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setUserLocation(null);
      setIsWatching(false);
      return;
    }

    if (!navigator.geolocation) {
      alert("Tu navegador no soporta Geolocation");
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error(err);
        alert("Error al obtener ubicación: " + err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );

    setWatchId(id);
    setIsWatching(true);
  };

  // 5. Restaurar seguimiento al recargar si estaba activo
  useEffect(() => {
    if (isWatching && watchId === null) {
      handleLocate();
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isWatching, watchId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="space-y-16">
      {/* HERO / CARRUSEL */}
      <div className="relative h-[280px] md:h-[440px] overflow-hidden">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${pos(i)}`}
          >
            <Image src={s.image} alt={s.title} fill className="object-cover" priority={i === 0} />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 space-y-2 md:space-y-4">
              <h1 className="text-2xl md:text-6xl font-bold text-white animate-fadeInUp">
                {s.title}
              </h1>
              <p className="text-lg md:text-3xl font-semibold text-white animate-fadeInUp">
                {s.subtitle}
              </p>
            </div>
          </div>
        ))}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDir(i > current ? "right" : "left");
                setCurrent(i);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-8 md:w-12 bg-amber-600" : "w-4 md:w-8 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* BIENVENIDA */}
      <section className="py-12 md:py-24 bg-amber-50">
        <div className="bg-white rounded-xl shadow-md px-6 py-10 mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-amber-700 uppercase">
            ¡Bienvenidos a La Loma!
          </h2>
          <p className="text-lg md:text-2xl font-semibold text-amber-900">
            El auténtico sabor cubano
          </p>
          <div className="flex flex-col gap-4 md:flex-row md:justify-center md:gap-6">
            <CTAButtons />
          </div>
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <h3 className="text-2xl md:text-4xl font-bold text-gray-800 text-center mb-8">
          Nuestros Destacados
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: "/icons/olla.png", title: "Cocina Casera", desc: "Recetas familiares, sabor inolvidable" },
            { icon: "/icons/campana.png", title: "Atención Personalizada", desc: "Te hacemos sentir en casa" },
            { icon: "/icons/copa.png", title: "Eventos Privados", desc: "Celebra con sabor y estilo" },
          ].map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition"
            >
              <Image src={f.icon} alt={f.title} width={64} height={64} className="mb-4" />
              <h4 className="text-lg font-bold mb-2">{f.title}</h4>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* UBICACIÓN */}
      <section className="mx-auto max-w-4xl px-4 py-12 md:py-16 space-y-6">
  <h3 className="text-2xl md:text-4xl font-bold text-gray-800 text-center">
    Encuéntranos aquí
  </h3>

  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
    <p className="text-gray-700">
      {userLocation
        ? `Tu ubicación: ${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`
        : "Tu ubicación no está detectada"}
    </p>
    <button
      onClick={handleLocate}
      className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded shadow"
    >
      {isWatching ? "Detener seguimiento" : "Ubicación en tiempo real"}
    </button>
  </div>

  {/* Contenedor responsivo del mapa */}
  <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-md">
    <LocationMap
      userLocation={userLocation}
      paladarLocation={{ lat: 21.5221, lng: -78.6417 }}
    />
  </div>
</section>

    </main>
  );
}
