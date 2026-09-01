// Empty string is a valid value: the single-service deployment serves this UI
// from the same origin as the API, so requests go to relative paths. Local dev
// sets VITE_API_URL=http://localhost:8000 to reach the API container.
const API_URL = import.meta.env.VITE_API_URL ?? "";

export async function getHealth() {
  const response = await fetch(`${API_URL}/health`);
  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }
  return response.json();
}

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, options);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.detail || `Request failed with status ${response.status}`);
  }
  return payload;
}

export function createScan(url) {
  return request("/api/scans", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
}

export function getScan(scanId) {
  return request(`/api/scans/${encodeURIComponent(scanId)}`);
}
