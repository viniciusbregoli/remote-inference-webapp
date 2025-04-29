"use client";

import { useRouter } from "next/navigation";
import Button from "../components/ui/Button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 text-gray-800">
      <div className="container mx-auto px-6 py-20 flex-grow flex flex-col justify-center">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6 leading-tight">
            Remote Inference API
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10">
            Effortlessly integrate powerful computer vision into your
            applications. Detect objects in images with state-of-the-art
            accuracy via a simple API.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => router.push("/login")}
              className="px-8 py-3 text-lg font-semibold !bg-indigo-600 hover:!bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Get Started <ArrowRightIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 mt-auto pt-8 border-t border-gray-200">
          <p>© 2025 Remote Inference API. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
