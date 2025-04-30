"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "../../../components/image-detection/ImageUpload";
import ResultsDisplay from "../../../components/image-detection/ResultsDisplay";
import Button from "../../../components/ui/Button";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import { useImageDetection } from "../../../hooks/useImageDetection";
import { isLoggedIn } from "../../../services/auth";
import { getCurrentUser } from "../../../services/api";

export default function DetectionPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    preview,
    resultImage,
    isLoading: detectionLoading,
    error,
    handleImageChange,
    handleDetection,
  } = useImageDetection();

  // Check authentication and admin status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      if (!isLoggedIn()) {
        router.push("/login");
        return;
      }

      try {
        const user = await getCurrentUser();

        // If not admin, redirect to dashboard
        if (!user.is_admin) {
          router.push("/dashboard");
          return;
        }

        setIsAdmin(true);
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleDetection();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // If not admin, show an access denied message
  if (!isAdmin) {
    return (
      <div className="p-8">
        <ErrorMessage
          title="Access Denied"
          message="You need administrator privileges to access this page."
        />
      </div>
    );
  }

  return (
    <main className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          Object Detection
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column: Upload Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Upload Your Image
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <ImageUpload
                preview={preview}
                isLoading={detectionLoading}
                onImageChange={handleImageChange}
              />

              <Button
                type="submit"
                disabled={!preview || detectionLoading}
                isLoading={detectionLoading}
                fullWidth={true}
              >
                Detect Objects
              </Button>
            </form>

            {error && <ErrorMessage message={error} />}
          </div>

          {/* Right Column: Results Display */}
          <ResultsDisplay
            resultImage={resultImage}
            isLoading={detectionLoading}
          />
        </div>
      </div>
    </main>
  );
}
