const API_URL = import.meta.env.VITE_API_URL;

export async function getHealth() {
  const response = await fetch(`${API_URL}/health`);
  if (!response.ok) throw new Error("Backend is unavailable");
  return response.json();
}

export async function createScan(url) {
  const response = await fetch(`${API_URL}/api/scans`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!response.ok) throw new Error((await response.json()).detail || "Could not start scan");
  return response.json();
}

export async function getScan(scanId) {
  const response = await fetch(`${API_URL}/api/scans/${scanId}`);
  if (!response.ok) throw new Error("Could not load scan");
  return response.json();
}
