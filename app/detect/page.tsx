"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "../../components/image-detection/ImageUpload";
import ResultsDisplay from "../../components/image-detection/ResultsDisplay";
import Button from "../../components/ui/Button";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { useImageDetection } from "../../hooks/useImageDetection";
import { isLoggedIn } from "../../services/auth";
import { LogOut, Home } from "lucide-react";
import { logout } from "../../services/auth";

export default function DetectionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const {
    preview,
    resultImage,
    isLoading: detectionLoading,
    error,
    handleImageChange,
    handleDetection,
  } = useImageDetection();

  // Check authentication on component mount
  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    setIsLoading(false);
  }, [router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleDetection();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-900 text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">YOLO Detection API</h1>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center text-indigo-100 hover:text-white"
            >
              <Home className="h-5 w-5 mr-1" />
              <span>Home</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center text-indigo-100 hover:text-white"
            >
              <LogOut className="h-5 w-5 mr-1" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="py-10 px-4 sm:px-6 lg:px-8">
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
    </div>
  );
}
