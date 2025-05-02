import { getAuthHeader } from "./auth";
import { getCurrentUser } from "./userService";

const API_URL = "http://localhost:5000";


export async function getUserApiKeys() {
  const headers = { ...getAuthHeader() };

  const response = await fetch(`${API_URL}/api-keys/me`, { headers });

  if (!response.ok) {
    throw new Error("Failed to fetch API keys");
  }

  return response.json();
}

export async function getAllApiKeys() {
  const headers = { ...getAuthHeader() };

  // First check if the current user is an admin
  const currentUser = await getCurrentUser();
  if (!currentUser.is_admin) {
    throw new Error("Access denied: Admin privileges required");
  }

  const response = await fetch(`${API_URL}/api-keys/`, { headers });

  if (!response.ok) {
    throw new Error("Failed to fetch API keys");
  }

  return response.json();
}

export async function getUserApiKeysByUserId(userId: number) {
  const headers = { ...getAuthHeader() };

  const response = await fetch(`${API_URL}/api-keys/user/${userId}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch API keys");
  }

  return response.json();
}

export async function createApiKey(userId: number, name: string, expiresAt?: string) {
  const headers = { ...getAuthHeader(), "Content-Type": "application/json" };

  const body = {
    user_id: userId,
    name,
    expires_at: expiresAt,
  };

  const response = await fetch(`${API_URL}/api-keys/`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to create API key");
  }

  return response.json();
}

export async function deactivateApiKey(keyId: number) {
  const headers = { ...getAuthHeader() };

  const response = await fetch(`${API_URL}/api-keys/${keyId}/deactivate`, {
    method: "PUT",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to deactivate API key");
  }

  return response.json();
}

export async function activateApiKey(keyId: number) {
  const headers = { ...getAuthHeader() };

  const response = await fetch(`${API_URL}/api-keys/${keyId}/activate`, {
    method: "PUT",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to activate API key");
  }

  return response.json();
}

export async function deleteApiKey(keyId: number) {
  const headers = { ...getAuthHeader() };

  const response = await fetch(`${API_URL}/api-keys/${keyId}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to delete API key");
  }
}