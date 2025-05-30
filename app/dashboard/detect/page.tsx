"use client";

import { FormEvent } from "react";
import ImageUpload from "../../../components/image-detection/ImageUpload";
import ResultsDisplay from "../../../components/image-detection/ResultsDisplay";
import Button from "../../../components/ui/Button";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import { useImageDetection } from "../../../hooks/useImageDetection";
import { Camera } from "lucide-react";

export default function DetectionPage() {
  const {
    preview,
    resultImage,
    isLoading: detectionLoading,
    error,
    handleImageChange,
    handleDetection,
    resetDetection,
  } = useImageDetection();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleDetection();
  };

  return (
    <main className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Object Detection</h1>

        {resultImage && (
          <Button
            variant="secondary"
            onClick={resetDetection}
            className="flex items-center"
          >
            Start New Detection
          </Button>
        )}
      </div>

      {/* Error Message at the top - visible at all times */}
      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        {/* Left Column: Upload Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 h-full flex flex-col">
          <div className="flex items-center mb-2">
            <Camera className="h-5 w-5 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-700">
              Upload Your Image
            </h2>
          </div>

          <p className="text-gray-500 text-sm mb-4">
            Upload an image and our AI will detect and label objects within it.
            Supported formats: JPEG, PNG, WebP. Max size: 10MB.
          </p>

          <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
            <div className="flex-grow">
              <ImageUpload
                preview={preview}
                isLoading={detectionLoading}
                onImageChange={handleImageChange}
              />
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                disabled={!preview || detectionLoading}
                isLoading={detectionLoading}
                fullWidth={true}
              >
                Detect Objects
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Results Display */}
        <ResultsDisplay
          resultImage={resultImage}
          isLoading={detectionLoading}
        />
      </div>

      {/* API Usage Example */}
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          API Usage Example
        </h2>
        <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
          <pre className="text-sm">
            <code>
              {`# Detect objects in an image using your API key
curl -X POST http://localhost:5000/detect \\
  -H "X-API-Key: your_api_key_here" \\
  -F "image=@path/to/your/image.jpg" \\
  -o annotated_image.jpg`}
            </code>
          </pre>
        </div>
        <p className="text-gray-500 text-sm mt-4">
          The API returns the annotated image with bounding boxes and labels for
          detected objects. You can generate your API key in the{" "}
          <a
            href="/dashboard/my-api-keys"
            className="text-indigo-600 hover:text-indigo-800"
          >
            My API Keys
          </a>{" "}
          section.
        </p>
      </div>
    </main>
  );
}
