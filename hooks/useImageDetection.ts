import { useState, useEffect } from "react";
import { detectObjects } from "../services/api";
import { Detection } from "../types";

export function useImageDetection(apiKey: string) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<Detection | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clean up URL when component unmounts or when it changes
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke previous URL if it exists
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }

      // File size validation (10MB limit)
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSizeInBytes) {
        setError(
          "File size exceeds 10MB limit. Please select a smaller image."
        );
        return;
      }

      // File type validation
      const supportedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];
      if (!supportedTypes.includes(file.type)) {
        setError(
          "Unsupported file type. Please select a PNG, JPG, or WEBP image."
        );
        return;
      }

      setSelectedImage(file);
      setDetectionResult(null);
      setError(null);

      // Create a new object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleDetection = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      const result = await detectObjects(formData, apiKey);
      setDetectionResult(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setError(errorMessage);
      console.error("Error processing image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetDetection = () => {
    setDetectionResult(null);

    if (selectedImage) {
      setSelectedImage(null);
    }

    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }

    setError(null);
  };

  return {
    selectedImage,
    preview,
    detectionResult,
    isLoading,
    error,
    handleImageChange,
    handleDetection,
    resetDetection,
    setError,
  };
}
