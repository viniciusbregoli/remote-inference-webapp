// API service for YOLO Object Detection API

import { Detection } from "../types";

export async function detectObjects(
  formData: FormData,
  apiKey: string
): Promise<Detection> {
  const response = await fetch("/api/detect", {
    method: "POST",
    headers: {
      "X-API-Key": apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.detail || `Request failed with status ${response.status}`
    );
  }

  return response.json();
}
