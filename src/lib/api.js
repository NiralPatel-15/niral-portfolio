function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("supabase_token");
}

async function request(url, { method = "GET", body, headers = {} } = {}) {
  const token = getToken();

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let errorText;

    try {
      const errBody = await res.json();
      errorText = errBody.error || JSON.stringify(errBody);
    } catch {
      errorText = await res.text().catch(() => `HTTP ${res.status}`);
    }

    throw new Error(errorText);
  }

  if (res.status === 204) return null;

  return res.json();
}

export const api = {
  auth: {
    async login(email, password) {
      return request("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
    },

    async me(token) {
      if (!token) return null;

      try {
        return await request("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch {
        return null;
      }
    },
  },

  admin: {
    fetch(table, { method = "GET", query = "", body } = {}) {
      return request(`/api/admin/${table}${query}`, {
        method,
        body,
      });
    },
  },

  public: {
    fetch(table, query = "") {
      return request(`/api/public/${table}${query}`).catch(() => null);
    },
  },
};
