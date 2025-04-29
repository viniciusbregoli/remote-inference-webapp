"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Key, BarChart2, LogOut, Image } from "lucide-react";
import { logout } from "../../services/auth";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="min-h-screen bg-indigo-900 text-white w-64 py-6 px-4 flex flex-col">
      <div className="mb-10">
        <h1 className="text-xl font-bold">YOLO Detection API</h1>
        <p className="text-indigo-200 text-sm mt-1">Admin Dashboard</p>
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
              href="/dashboard/usage"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive("/dashboard/usage")
                  ? "bg-indigo-800 text-white"
                  : "text-indigo-100 hover:bg-indigo-800"
              }`}
            >
              <BarChart2 className="mr-3 h-5 w-5" />
              <span>Usage Statistics</span>
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
              <Image className="mr-3 h-5 w-5" />
              <span>Object Detection</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto pt-6 border-t border-indigo-800">
        <Link
          href="/"
          className="flex items-center px-4 py-3 w-full text-left rounded-lg text-indigo-100 hover:bg-indigo-800 transition-colors mb-2"
        >
          <Home className="mr-3 h-5 w-5" />
          <span>Home</span>
        </Link>

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
