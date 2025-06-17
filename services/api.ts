// API service for YOLO Object Detection API

export async function detectObjects(
  formData: FormData,
  apiKey: string,
  onProgress?: (progress: number) => void
) {
  return new Promise(async (resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/api/detect", true);

    xhr.setRequestHeader("X-API-Key", apiKey);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const blob = new Blob([xhr.response], { type: "image/jpeg" });
        resolve(blob);
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          reject(new Error(errorData.detail || `Request failed with status ${xhr.status}`));
        } catch (e) {
          reject(new Error(`Request failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network request failed"));
    };

    xhr.responseType = "arraybuffer";
    xhr.send(formData);
  });
}
