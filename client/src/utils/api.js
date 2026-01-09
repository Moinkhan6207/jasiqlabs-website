const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export async function submitLead(payload) {
  const res = await fetch(`${API_BASE}/api/public/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Failed to submit lead");
  }
  return data;
}









