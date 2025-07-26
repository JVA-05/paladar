// src/lib/apiClient.ts

import { getCookie } from "./cookieUtils"

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL
// quita slash final y, si no está definida, queda cadena vacía
const API_URL = rawApiUrl ? rawApiUrl.replace(/\/$/, "") : ""

/**
 * apiFetch: wrapper para fetch que normaliza rutas,
 * inyecta headers JSON y Authorization, y parsea la respuesta.
 */
export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  // 1) Token desde cookie (solo si existe)
  const token = getCookie("auth-token")

  // 2) Construye headers: JSON por defecto + Bearer si hay token
  const headers = new Headers(options.headers || {})
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  // 3) Normaliza la ruta y construye el endpoint final
  const route = path.startsWith("/") ? path : `/${path}`
  // Si API_URL está definido, lo antepone; si no, ruta relativa
  const endpoint = API_URL ? `${API_URL}${route}` : route

  console.log("👉 apiFetch endpoint:", endpoint)

  // 4) Ejecuta la petición
  const res = await fetch(endpoint, {
    credentials: "include",
    ...options,
    headers,
  })

  // 5) Si es 204 No Content, devolvemos null
  if (res.status === 204) {
    return null
  }

  // 6) Leemos el cuerpo como texto (evita JSON vacío)
  const text = await res.text()
  if (!text) {
    return null
  }

  // 7) Intentamos parsear JSON; si falla, lanzamos error
  let json: any
  try {
    json = JSON.parse(text)
  } catch (err) {
    throw new Error(`Invalid JSON response: ${text}`)
  }

  // 8) Si la respuesta no fue ok, extraemos mensaje y lanzamos
  if (!res.ok) {
    const message = json?.error || res.statusText
    throw new Error(message)
  }

  return json
}
