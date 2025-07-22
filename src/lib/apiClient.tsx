// src/lib/apiClient.ts
import { getCookie } from "./cookieUtils";

export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getCookie("auth-token");

  // Construye headers
  const headers = new Headers(options.headers || {});

  // Si no es FormData, forzamos JSON
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Añadimos Authorization si tenemos token
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",   // PARA enviar/recibir cookies
    ...options,
    headers,
  });

  // Si no hay cuerpo (204), devolvemos null
  if (res.status === 204) return null;

  // Leemos texto para evitar error de JSON vacío
  const text = await res.text();
  if (!text) return null;

  // Parseamos JSON y manejamos errores
  const json = JSON.parse(text);
  if (!res.ok) {
    throw new Error(json.error || res.statusText);
  }
  return json;
}
