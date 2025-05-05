"use client";

import { useRouter } from "next/navigation";
import Button from "../components/ui/Button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-100 via-white to-blue-100 text-gray-900">
      <div className="container mx-auto px-6 py-20 flex-grow flex flex-col justify-center items-center">
        {/* Hero Section */}
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 mb-6 leading-tight tracking-tight">
            Remote Inference API
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed">
            Administrative panel for the Remote Inference API.
          </p>
          <div className="flex justify-center">
            <Button
              onClick={() => router.push("/login")}
              className="px-10 py-4 text-lg font-semibold !bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3 rounded-lg"
            >
              Login <ArrowRightIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-600 mt-auto pt-10 border-t border-gray-200 w-full max-w-4xl">
          <p>© 2025 Remote Inference API. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
