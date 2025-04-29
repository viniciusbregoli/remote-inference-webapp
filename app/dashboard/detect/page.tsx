"use client";

import { FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "../../../components/image-detection/ImageUpload"; // Adjusted path
import ResultsDisplay from "../../../components/image-detection/ResultsDisplay"; // Adjusted path
import Button from "../../../components/ui/Button"; // Adjusted path
import ErrorMessage from "../../../components/ui/ErrorMessage"; // Adjusted path
import { useImageDetection } from "../../../hooks/useImageDetection"; // Adjusted path
import { isLoggedIn } from "../../../services/auth"; // Adjusted path

export default function DetectionPage() {
  const router = useRouter();
  const {
    preview,
    resultImage,
    isLoading,
    error,
    authError,
    handleImageChange,
    handleDetection,
  } = useImageDetection();

  // Check authentication on component mount
  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleDetection();
  };

  // If not logged in, show a simplified view
  if (typeof window !== "undefined" && !isLoggedIn()) {
    return <div>Redirecting to login...</div>;
  }

  // Remove the gradient background and adjust padding/margins for dashboard integration
  return (
    <main className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Removed header as it's likely part of the shared layout */}
        {/* <header className="flex justify-between items-center mb-12"> ... </header> */}

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
                isLoading={isLoading}
                onImageChange={handleImageChange}
              />

              <Button
                type="submit"
                disabled={!preview || isLoading}
                isLoading={isLoading}
                fullWidth={true}
              >
                Detect Objects
              </Button>
            </form>

            {error && <ErrorMessage message={error} />}

            {/* Auth error handling might be redundant if layout handles it */}
            {authError && (
              <div className="mt-4 text-center">
                <p className="text-gray-600 mb-3">
                  You need to be logged in to use this feature.
                </p>
                <Link
                  href="/login"
                  className="text-indigo-600 font-medium hover:text-indigo-500"
                >
                  Sign in now
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Results Display */}
          <ResultsDisplay resultImage={resultImage} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
}
