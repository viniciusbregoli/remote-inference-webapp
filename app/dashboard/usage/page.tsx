"use client";

import { useState, useEffect } from "react";
import { BarChart2, TrendingUp, Clock, Activity } from "lucide-react";
import { getAuthHeader } from "../../../services/auth";

interface UsageStats {
  daily_usage: number;
  monthly_usage: number;
  daily_limit: number;
  monthly_limit: number;
  daily_percentage: number;
  monthly_percentage: number;
}

export default function UsageStatsPage() {
  const [stats, setStats] = useState<UsageStats | null>(null);
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
        <p className="font-medium">Error loading usage statistics</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Usage Statistics</h1>
        <p className="text-gray-600">
          Monitor your API usage and stay within your limits
        </p>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Daily API Calls"
              value={stats.daily_usage.toString()}
              icon={<Activity className="h-6 w-6 text-indigo-600" />}
              subtitle="Requests today"
              color="indigo"
            />
            <StatCard
              title="Monthly API Calls"
              value={stats.monthly_usage.toString()}
              icon={<TrendingUp className="h-6 w-6 text-green-600" />}
              subtitle="Requests this month"
              color="green"
            />
            <StatCard
              title="Daily Limit"
              value={`${stats.daily_percentage.toFixed(1)}%`}
              icon={<Clock className="h-6 w-6 text-amber-600" />}
              subtitle={`${stats.daily_usage} / ${stats.daily_limit} requests`}
              color="amber"
              percentage={stats.daily_percentage}
            />
            <StatCard
              title="Monthly Limit"
              value={`${stats.monthly_percentage.toFixed(1)}%`}
              icon={<BarChart2 className="h-6 w-6 text-blue-600" />}
              subtitle={`${stats.monthly_usage} / ${stats.monthly_limit} requests`}
              color="blue"
              percentage={stats.monthly_percentage}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UsageChart
              title="Daily Usage"
              percentage={stats.daily_percentage}
              used={stats.daily_usage}
              total={stats.daily_limit}
              color="indigo"
            />
            <UsageChart
              title="Monthly Usage"
              percentage={stats.monthly_percentage}
              used={stats.monthly_usage}
              total={stats.monthly_limit}
              color="blue"
            />
          </div>

          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Usage Tips</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <div className="h-5 w-5 text-green-500 mr-2">•</div>
                <span>Your daily limit resets at midnight UTC.</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 text-green-500 mr-2">•</div>
                <span>
                  Monthly limits reset on the first day of each month.
                </span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 text-green-500 mr-2">•</div>
                <span>
                  If you need higher limits, please contact the administrator.
                </span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: "indigo" | "green" | "amber" | "blue";
  percentage?: number;
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
  percentage,
}: StatCardProps) {
  const colors = {
    indigo: "bg-indigo-50",
    green: "bg-green-50",
    amber: "bg-amber-50",
    blue: "bg-blue-50",
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`${colors[color]} p-3 rounded-lg`}>{icon}</div>
      </div>
      {percentage !== undefined && (
        <div className="mt-4 w-full bg-gray-200 h-2 rounded-full overflow-hidden">
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
  );
}

interface UsageChartProps {
  title: string;
  percentage: number;
  used: number;
  total: number;
  color: "indigo" | "blue";
}

function UsageChart({
  title,
  percentage,
  used,
  total,
  color,
}: UsageChartProps) {
  const colors = {
    indigo: {
      text: "text-indigo-700",
      light: "text-indigo-300",
      bg: "bg-indigo-500",
    },
    blue: {
      text: "text-blue-700",
      light: "text-blue-300",
      bg: "bg-blue-500",
    },
  };

  // Calculate stroke dasharray and dash offset for the SVG circle
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="flex items-center justify-between">
        <div className="relative w-48 h-48 mx-auto">
          <svg
            className="w-full h-full"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="20"
            />
            {/* Progress circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={color === "indigo" ? "#6366f1" : "#3b82f6"}
              strokeWidth="20"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
            {/* Text in the middle */}
            <text
              x="100"
              y="90"
              textAnchor="middle"
              fontSize="28"
              fontWeight="bold"
              fill="#374151"
            >
              {percentage.toFixed(1)}%
            </text>
            <text
              x="100"
              y="120"
              textAnchor="middle"
              fontSize="14"
              fill="#6b7280"
            >
              Used
            </text>
          </svg>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Used</p>
            <p className={`text-xl font-semibold ${colors[color].text}`}>
              {used.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Available</p>
            <p className={`text-lg ${colors[color].light}`}>
              {(total - used).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Limit</p>
            <p className="text-lg text-gray-600">{total.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
