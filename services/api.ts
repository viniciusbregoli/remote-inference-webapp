// API service for YOLO Object Detection API
import { getAuthHeader } from "./auth";

const API_URL = "http://localhost:5000";

/**
 * Sends an image to the object detection API
 * @param image The image file to process
 * @returns A Promise with the blob response
 */
export async function detectObjects(image: File): Promise<Blob> {
  const formData = new FormData();
  formData.append("image", image);

  const headers = {
    ...getAuthHeader(),
  };

  const response = await fetch(`${API_URL}/detect`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = `Detection failed with status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || JSON.stringify(errorData);
    } catch {
      errorMessage = (await response.text()) || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return await response.blob();
}

/**
 * Check the health status of the API
 * @returns A Promise with the health check response
 */
export async function checkApiHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_URL}/health`);

  if (!response.ok) {
    throw new Error("API health check failed");
  }

  return await response.json();
}

/**
 * Get current user information
 * @returns User information
 */
export async function getCurrentUser() {
  const headers = {
    ...getAuthHeader(),
  };

  const response = await fetch(`${API_URL}/users/me`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user information");
  }

  return response.json();
}

/**
 * Get user statistics
 * @returns User usage statistics
 */
export async function getUserStats() {
  const headers = {
    ...getAuthHeader(),
  };

  const response = await fetch(`${API_URL}/users/me/stats`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user statistics");
  }

  return response.json();
}

/**
 * Get user's API keys
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
 * @param name Name/description for the API key
 * @returns The created API key
 */
export async function createApiKey(name: string) {
  const headers = {
    ...getAuthHeader(),
    "Content-Type": "application/json",
  };

  const response = await fetch(`${API_URL}/api-keys`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to create API key");
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
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to activate API key");
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
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to deactivate API key");
  }

  return response.json();
}

/**
 * Load a specific model
 * @param modelName Name of the model to load
 * @returns Response from the API
 */
export async function loadModel(modelName: string) {
  const headers = {
    ...getAuthHeader(),
    "Content-Type": "application/json",
  };

  const response = await fetch(`${API_URL}/load_model`, {
    method: "POST",
    headers,
    body: JSON.stringify({ model_name: modelName }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to load model");
  }

  return response.json();
}