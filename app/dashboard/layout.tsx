"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../components/dashboard/Navigation";
import { isLoggedIn } from "../../services/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Check authentication on component mount
  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <main className="p-6 sm:p-10">
          {isLoggedIn() ? children : <div>Loading...</div>}
        </main>
      </div>
    </div>
  );
}
