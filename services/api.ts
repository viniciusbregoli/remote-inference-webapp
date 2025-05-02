// API service for YOLO Object Detection API
import { getAuthHeader } from "./auth";

const API_URL = "http://localhost:5000";

export async function detectObjects(image: File): Promise<Blob> {
  const formData = new FormData();
  formData.append("image", image);

  const headers = { ...getAuthHeader() };

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
