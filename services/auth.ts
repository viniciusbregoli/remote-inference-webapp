import { LoginCredentials } from "../types";

export async function login(credentials: LoginCredentials) {
  const formData = new URLSearchParams();
  formData.append("username", credentials.username);
  formData.append("password", credentials.password);

  const response = await fetch(`http://localhost:5000/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Login failed");
  }

  const data = await response.json();
  localStorage.setItem("accessToken", data.access_token);
}

export function logout(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem("accessToken");
  window.location.href = "/login";
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const token = getToken();
    return !!token; // Return true if token exists and is not null/undefined/empty
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return false;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("accessToken");
}

export function getAuthHeader(): Record<string, string> {
  const token = getToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}
