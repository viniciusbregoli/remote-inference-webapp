"use client";

import { useState, useEffect } from "react";
import { BarChart2, User, Box, Clock } from "lucide-react";
import { getAuthHeader } from "../../services/auth";

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-500">Loading statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p className="font-medium">Error loading dashboard</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">
          Welcome to your YOLO Detection API dashboard
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Daily API Usage"
            value={`${stats.daily_usage} / ${stats.daily_limit}`}
            icon={<BarChart2 className="h-6 w-6 text-indigo-600" />}
            percentage={stats.daily_percentage}
          />
          <StatCard
            title="Monthly API Usage"
            value={`${stats.monthly_usage} / ${stats.monthly_limit}`}
            icon={<Clock className="h-6 w-6 text-indigo-600" />}
            percentage={stats.monthly_percentage}
          />
          <StatCard
            title="Objects Detected"
            value="View analytics"
            icon={<Box className="h-6 w-6 text-indigo-600" />}
            linkTo="/dashboard/usage"
          />
          <StatCard
            title="API Keys"
            value="Manage keys"
            icon={<User className="h-6 w-6 text-indigo-600" />}
            linkTo="/dashboard/api-keys"
          />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-500">
          View your recent API usage and activity in the Usage Statistics tab.
        </p>
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
  return (
    <div className="bg-white rounded-xl shadow-md p-6 relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-xl font-semibold mt-1">{value}</p>
          {percentage !== undefined && (
            <div className="mt-3 w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  percentage > 80
                    ? "bg-red-500"
                    : percentage > 50
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          )}
        </div>
        <div className="bg-indigo-50 p-3 rounded-lg">{icon}</div>
      </div>
      {linkTo && (
        <a
          href={linkTo}
          className="absolute inset-0 flex items-center justify-center bg-indigo-600 bg-opacity-0 opacity-0 hover:bg-opacity-10 hover:opacity-100 transition-all duration-300"
        >
          <span className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm">
            View Details
          </span>
        </a>
      )}
    </div>
  );
}
