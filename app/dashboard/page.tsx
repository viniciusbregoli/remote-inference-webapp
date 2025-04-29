"use client";

import { useState, useEffect } from "react";
import {
  BarChart2,
  User,
  Box,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { getAuthHeader } from "../../services/auth";
import Link from "next/link";

interface UserStats {
  daily_usage: number;
  monthly_usage: number;
  daily_limit: number;
  monthly_limit: number;
  daily_percentage: number;
  monthly_percentage: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const headers = {
          ...getAuthHeader(),
        };

        const response = await fetch("http://localhost:5000/users/me/stats", {
          headers,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch statistics"
        );
        console.error("Error fetching stats:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
        <div className="flex items-center space-x-2 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md flex items-center space-x-3">
          <AlertCircle className="h-6 w-6" />
          <div>
            <p className="font-bold">Error loading dashboard</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            Welcome! Here&apos;s an overview of your API usage.
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard
              title="Daily API Usage"
              value={`${stats.daily_usage} / ${stats.daily_limit}`}
              icon={<BarChart2 className="h-6 w-6 text-indigo-500" />}
              percentage={stats.daily_percentage}
            />
            <StatCard
              title="Monthly API Usage"
              value={`${stats.monthly_usage} / ${stats.monthly_limit}`}
              icon={<Clock className="h-6 w-6 text-teal-500" />}
              percentage={stats.monthly_percentage}
            />
            <StatCard
              title="Objects Detected"
              value="View Analytics"
              icon={<Box className="h-6 w-6 text-amber-500" />}
              linkTo="/dashboard/usage"
            />
            <StatCard
              title="API Keys"
              value="Manage Keys"
              icon={<User className="h-6 w-6 text-sky-500" />}
              linkTo="/dashboard/api-keys"
            />
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Activity
          </h2>
          <p className="text-gray-600">
            Track your API calls and analyze detection results in the Usage
            Statistics section.
          </p>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  percentage?: number;
  linkTo?: string;
}

function StatCard({ title, value, icon, percentage, linkTo }: StatCardProps) {
  const cardContent = (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-4">
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="text-2xl font-semibold text-gray-800 mt-1 truncate">
            {value}
          </p>
        </div>
        <div className="bg-gray-100 p-3 rounded-full flex-shrink-0">{icon}</div>
      </div>
      {percentage !== undefined && (
        <div className="mt-auto pt-2">
          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentage > 80
                  ? "bg-red-500"
                  : percentage > 50
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">
            {percentage.toFixed(0)}% Used
          </p>
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link href={linkTo} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
