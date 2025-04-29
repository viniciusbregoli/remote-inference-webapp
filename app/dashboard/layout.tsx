"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../components/dashboard/Navigation";
import { isLoggedIn } from "../../services/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isLoggedIn()) {
      router.push("/login");
    }
  }, [router]);

  if (!isMounted) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Navigation />
        <div className="flex-1 overflow-auto">
          <main className="p-6 sm:p-10">
            <div>Loading...</div>
          </main>
        </div>
      </div>
    );
  }

  if (!isLoggedIn()) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Navigation />
        <div className="flex-1 overflow-auto">
          <main className="p-6 sm:p-10">
            <div>Redirecting to login...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <main className="p-6 sm:p-10">{children}</main>
      </div>
    </div>
  );
}
