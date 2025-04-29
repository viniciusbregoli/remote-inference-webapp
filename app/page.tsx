"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isLoggedIn } from "../services/auth";
import { Camera, Lock, BarChart2 } from "lucide-react";
import Button from "../components/ui/Button";

export default function LandingPage() {
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      router.push("/detect");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            YOLO Object Detection API
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Powerful computer vision technology with a simple interface. Detect
            objects in images with state-of-the-art accuracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/login")}
              className="px-8 py-3 text-lg"
            >
              Sign In
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/detect")}
              className="px-8 py-3 text-lg"
            >
              Try Detection
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<Camera className="h-10 w-10 text-indigo-600" />}
            title="Object Detection"
            description="Detect multiple objects in images with high accuracy using YOLOv8 models."
          />
          <FeatureCard
            icon={<Lock className="h-10 w-10 text-indigo-600" />}
            title="Secure API"
            description="Access the API securely with API keys and JWT authentication."
          />
          <FeatureCard
            icon={<BarChart2 className="h-10 w-10 text-indigo-600" />}
            title="Usage Analytics"
            description="Monitor your API usage with detailed statistics and visualizations."
          />
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-600 mt-24">
          <p>© 2025 YOLO Object Detection API. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
