function normalizeBase(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

export function getApiBase() {
  return normalizeBase(import.meta.env.VITE_API_BASE_URL) || "http://localhost:4000/api";
}

function buildQuery(query = {}) {
  const search = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "" || value === "all") {
      return;
    }
    search.set(key, String(value));
  });
  const text = search.toString();
  return text ? `?${text}` : "";
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
}

export async function request(path, options = {}) {
  const response = await fetch(`${getApiBase()}${path}${buildQuery(options.query)}`, {
    method: options.method || "GET",
    headers: {
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.body ? { "Content-Type": "application/json" } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const payload = await parseResponse(response);
  if (!response.ok) {
    const error = new Error(payload?.message || "Request failed");
    error.statusCode = response.status;
    throw error;
  }

  return payload;
}

export async function downloadFile(path, token, suggestedName = "document.pdf") {
  const response = await fetch(`${getApiBase()}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });

  if (!response.ok) {
    const payload = await parseResponse(response);
    const error = new Error(payload?.message || "Download failed");
    error.statusCode = response.status;
    throw error;
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = suggestedName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
