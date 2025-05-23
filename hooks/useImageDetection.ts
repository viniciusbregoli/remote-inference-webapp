import { useState, useEffect } from "react";
import { detectObjects } from "../services/api";
import { isLoggedIn } from "../services/auth";

export function useImageDetection() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<boolean>(false);

  // Check if user is authenticated
  useEffect(() => {
    if (typeof window !== 'undefined') { // Check if we're in the browser
      const loggedIn = isLoggedIn();
      if (!loggedIn) {
        setAuthError(true);
        setError("Authentication required. Please log in to use this feature.");
      } else {
        setAuthError(false);
        setError(null);
      }
    }
  }, []);

  // Clean up URLs when component unmounts or when they change
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
      if (resultImage && resultImage.startsWith("blob:")) {
        URL.revokeObjectURL(resultImage);
      }
    };
  }, [preview, resultImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // If not authenticated, don't allow image selection
    if (authError) {
      return;
    }
    
    const file = e.target.files?.[0];
    if (file) {
      // Revoke previous URL if it exists
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }

      // File size validation (10MB limit)
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSizeInBytes) {
        setError("File size exceeds 10MB limit. Please select a smaller image.");
        return;
      }

      // File type validation
      const supportedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!supportedTypes.includes(file.type)) {
        setError("Unsupported file type. Please select a PNG, JPG, or WEBP image.");
        return;
      }

      setSelectedImage(file);
      setResultImage(null);
      setError(null);

      // Create a new object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleDetection = async () => {
    if (!selectedImage || authError) return;

    setIsLoading(true);
    setError(null);

    // Clean up previous result URL
    if (resultImage && resultImage.startsWith("blob:")) {
      URL.revokeObjectURL(resultImage);
      setResultImage(null);
    }

    try {
      const blob = await detectObjects(selectedImage);
      const imageUrl = URL.createObjectURL(blob);
      setResultImage(imageUrl);
    } catch (error) {
      // Check if it's an authentication error
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes("401") || errorMessage.includes("unauthorized")) {
        setAuthError(true);
        setError("Authentication required. Please log in to use this feature.");
      } else {
        setError(errorMessage);
      }
      
      console.error("Error processing image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetDetection = () => {
    // Keep the selected image, but clear the result
    if (resultImage && resultImage.startsWith("blob:")) {
      URL.revokeObjectURL(resultImage);
      setResultImage(null);
    }
    
    // Optionally clear everything
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
    resultImage,
    isLoading,
    error,
    authError,
    handleImageChange,
    handleDetection,
    resetDetection,
    setError,
  };
}