export const API_URL = "http://localhost:5000/api";

export const request = async (path, method = "GET", data = null, token = null) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "API Error");
  return result;
};
