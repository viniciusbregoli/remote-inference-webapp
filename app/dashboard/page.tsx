"use client";

import { useState, useEffect } from "react";
import { Users, Key } from "lucide-react";
import { getCurrentUser } from "../../services/api";
import Link from "next/link";
import ErrorMessage from "../../components/ui/ErrorMessage";

export default function Dashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const user = await getCurrentUser();
        setIsAdmin(user.is_admin);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch user information"
        );
      } finally {
        setIsLoading(false);
      }
    }

    checkAdminStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // Regular users (non-admin) see a different dashboard
  if (!isAdmin) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome to the YOLO Object Detection API
          </h1>
          <p className="text-gray-600 mb-6">
            This platform is designed for administrators only. If you need to
            use the API services, please use the API documentation or contact
            your administrator for assistance.
          </p>
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-blue-700">
              For API usage and documentation, please visit our{" "}
              <Link href="/" className="font-medium underline">
                homepage
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600 mt-1">
          Welcome to your YOLO Detection API administration panel.
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
              Manage API keys and access credentials.
            </p>
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Administration Guide
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">User Management</h3>
            <p className="text-gray-600">
              Create and manage user accounts. Control access permissions and
              monitor user activity.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">API Keys</h3>
            <p className="text-gray-600">
              Generate, revoke, and manage API keys for user authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
