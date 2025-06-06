"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LogOut, Key, Users, Camera } from "lucide-react";
import { logout } from "../../services/auth";
import { getCurrentUser } from "../../services/userService";

export default function Navigation() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        setIsAdmin(user.is_admin);
        setUsername(user.username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-indigo-900 text-white w-64 py-6 px-4 flex flex-col">
        <div className="mb-10">
          <h1 className="text-xl font-bold">YOLO Detection API</h1>
          <div className="text-indigo-200 text-sm mt-4 flex items-center">
            <div className="animate-pulse h-4 w-24 bg-indigo-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // For regular users (non-admin), show a simplified navigation
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-indigo-900 text-white w-64 py-6 px-4 flex flex-col">
        <div className="mb-10">
          <h1 className="text-xl font-bold">YOLO Detection API</h1>
          <p className="text-indigo-200 text-sm mt-1">User Dashboard</p>
          <div className="text-indigo-300 mt-4 text-sm flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
            {username}
          </div>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive("/dashboard")
                    ? "bg-indigo-800 text-white"
                    : "text-indigo-100 hover:bg-indigo-800"
                }`}
              >
                <Home className="mr-3 h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/my-api-keys"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive("/dashboard/my-api-keys")
                    ? "bg-indigo-800 text-white"
                    : "text-indigo-100 hover:bg-indigo-800"
                }`}
              >
                <Key className="mr-3 h-5 w-5" />
                <span>My API Keys</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/detect"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive("/dashboard/detect")
                    ? "bg-indigo-800 text-white"
                    : "text-indigo-100 hover:bg-indigo-800"
                }`}
              >
                <Camera className="mr-3 h-5 w-5" />
                <span>Object Detection</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mt-auto pt-6 border-t border-indigo-800">
          <button
            onClick={logout}
            className="flex items-center px-4 py-3 w-full text-left rounded-lg text-indigo-100 hover:bg-indigo-800 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  }

  // For admin users, keep the original admin navigation
  return (
    <div className="min-h-screen bg-indigo-900 text-white w-64 py-6 px-4 flex flex-col">
      <div className="mb-10">
        <h1 className="text-xl font-bold">YOLO Detection API</h1>
        <p className="text-indigo-200 text-sm mt-1">Admin Dashboard</p>
        <div className="text-indigo-300 mt-4 text-sm flex items-center">
          <div className="h-2 w-2 rounded-full bg-purple-400 mr-2"></div>
          {username} (Admin)
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive("/dashboard")
                  ? "bg-indigo-800 text-white"
                  : "text-indigo-100 hover:bg-indigo-800"
              }`}
            >
              <Home className="mr-3 h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/api-keys"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive("/dashboard/api-keys")
                  ? "bg-indigo-800 text-white"
                  : "text-indigo-100 hover:bg-indigo-800"
              }`}
            >
              <Key className="mr-3 h-5 w-5" />
              <span>API Keys</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/users"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive("/dashboard/users")
                  ? "bg-indigo-800 text-white"
                  : "text-indigo-100 hover:bg-indigo-800"
              }`}
            >
              <Users className="mr-3 h-5 w-5" />
              <span>Users</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/detect"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive("/dashboard/detect")
                  ? "bg-indigo-800 text-white"
                  : "text-indigo-100 hover:bg-indigo-800"
              }`}
            >
              <Camera className="mr-3 h-5 w-5" />
              <span>Object Detection</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto pt-6 border-t border-indigo-800">
        <button
          onClick={logout}
          className="flex items-center px-4 py-3 w-full text-left rounded-lg text-indigo-100 hover:bg-indigo-800 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
