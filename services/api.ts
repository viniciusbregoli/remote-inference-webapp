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

  // Get authentication headers
  const headers = {
    ...getAuthHeader(),
  };

  // Remove Content-Type as it will be set automatically for FormData
  if (headers["Content-Type"]) {
    delete headers["Content-Type"];
  }

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