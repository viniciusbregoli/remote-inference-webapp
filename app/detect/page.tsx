"use client";

import { FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "../../components/image-detection/ImageUpload";
import ResultsDisplay from "../../components/image-detection/ResultsDisplay";
import Button from "../../components/ui/Button";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { useImageDetection } from "../../hooks/useImageDetection";
import { isLoggedIn } from "../../services/auth";

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

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sky-50 to-indigo-100">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight mb-3">
              Object Detection
            </h1>
            <p className="text-lg text-gray-600">
              Upload an image and let our YOLOv8 model detect the objects within
              it.
            </p>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Dashboard
            </Button>
            <Button variant="secondary" onClick={() => router.push("/")}>
              Home
            </Button>
          </div>
        </header>

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
