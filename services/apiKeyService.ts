import { getAuthHeader } from "./auth";

const API_URL = "http://localhost:5000";

/**
 * Get all API keys for the current user
 * @returns List of API keys
 */
export async function getUserApiKeys() {
  const headers = {
    ...getAuthHeader(),
  };

  const response = await fetch(`${API_URL}/api-keys/me`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch API keys");
  }

  return response.json();
}

/**
 * Create a new API key
 * @param userId ID of the user who owns this key
 * @param name Name/description for the key
 * @param expiresAt Optional expiration date
 * @returns The created API key
 */
export async function createApiKey(userId: number, name: string, expiresAt?: string) {
  const headers = {
    ...getAuthHeader(),
    "Content-Type": "application/json",
  };

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

/**
 * Deactivate an API key
 * @param keyId ID of the key to deactivate
 * @returns The updated API key
 */
export async function deactivateApiKey(keyId: number) {
  const headers = {
    ...getAuthHeader(),
  };

  const response = await fetch(`${API_URL}/api-keys/${keyId}/deactivate`, {
    method: "PUT",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to deactivate API key");
  }

  return response.json();
}

/**
 * Activate an API key
 * @param keyId ID of the key to activate
 * @returns The updated API key
 */
export async function activateApiKey(keyId: number) {
  const headers = {
    ...getAuthHeader(),
  };

  const response = await fetch(`${API_URL}/api-keys/${keyId}/activate`, {
    method: "PUT",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to activate API key");
  }

  return response.json();
}

/**
 * Delete an API key
 * @param keyId ID of the key to delete
 */
export async function deleteApiKey(keyId: number) {
  const headers = {
    ...getAuthHeader(),
  };

  const response = await fetch(`${API_URL}/api-keys/${keyId}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to delete API key");
  }
}