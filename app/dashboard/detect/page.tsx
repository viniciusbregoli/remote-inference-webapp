"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ImageUpload from "../../../components/image-detection/ImageUpload";
import DetectionResultDisplay from "../../../components/image-detection/DetectionResultDisplay";
import Button from "../../../components/ui/Button";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import { useImageDetection } from "../../../hooks/useImageDetection";
import { Key } from "lucide-react";
import { ApiKey } from "@prisma/client";

export default function DetectionPage() {
  const { data: session, status } = useSession({ required: true });
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  const {
    preview,
    detectionResult,
    isLoading: detectionLoading,
    error: detectionError,
    handleImageChange,
    handleDetection,
  } = useImageDetection(apiKey || "");

  const userId = (session?.user as any)?.id;

  useEffect(() => {
    const fetchApiKey = async () => {
      if (userId) {
        try {
          const response = await fetch(`/api/apikeys/user/${userId}`);
          if (!response.ok) {
            throw new Error("Could not fetch API keys.");
          }
          const keys: ApiKey[] = await response.json();
          const activeKey = keys.find((k) => k.is_active);
          if (activeKey) {
            setApiKey(activeKey.key);
          } else {
            setApiKeyError(
              "No active API key found. Please create one in the dashboard."
            );
          }
        } catch (error) {
          setApiKeyError("Failed to load API key.");
        }
      }
    };
    fetchApiKey();
  }, [userId]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (apiKey) {
      handleDetection();
    }
  };

  if (
    status === "loading" ||
    (status === "authenticated" && !apiKey && !apiKeyError)
  ) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
        Object Detection
      </h1>
      {apiKeyError && (
        <div className="mb-8 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md">
          <div className="flex items-center">
            <Key size={24} className="mr-3" />
            <div>
              <p className="font-bold">API Key Error</p>
              <p>
                {apiKeyError}{" "}
                <Link
                  href="/dashboard/my-api-keys"
                  className="font-semibold underline hover:text-red-800"
                >
                  Go to My API Keys
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
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
              disabled={!preview || detectionLoading || !apiKey}
              isLoading={detectionLoading}
              fullWidth={true}
            >
              Detect Objects
            </Button>
          </form>
          {detectionError && <ErrorMessage message={detectionError} />}
        </div>
        <DetectionResultDisplay
          detectionResult={detectionResult}
          isLoading={detectionLoading}
        />
      </div>
    </div>
  );
}
