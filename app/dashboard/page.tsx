"use client";

import { useState, useEffect } from "react";
import { Key, Camera, Users } from "lucide-react";
import Link from "next/link";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isAdmin = (session?.user as any)?.is_admin;
  const username = session?.user?.name || "User";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // Admin dashboard
  if (isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            Welcome to your administration panel.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/dashboard/users">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 ml-3">
                  User Management
                </h2>
              </div>
              <p className="text-gray-600">
                Create, manage, and monitor user accounts.
              </p>
            </div>
          </Link>

          <Link href="/dashboard/api-keys">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Key className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 ml-3">
                  API Keys
                </h2>
              </div>
              <p className="text-gray-600">
                Manage API keys and access credentials for all users.
              </p>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  // Regular user dashboard
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Welcome, {username}
        </h1>
        <p className="text-lg text-gray-600 mt-1">
          API Dashboard
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link href="/dashboard/my-api-keys">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Key className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 ml-3">
                My API Keys
              </h2>
            </div>
            <p className="text-gray-600">
              Manage your API keys for integrating with our services.
            </p>
          </div>
        </Link>

        <Link href="/dashboard/detect">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Camera className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 ml-3">
                Object Detection
              </h2>
            </div>
            <p className="text-gray-600">
              Upload images and detect objects using the model.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
