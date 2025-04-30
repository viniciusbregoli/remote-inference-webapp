"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navigation from "../../components/dashboard/Navigation";
import { isLoggedIn } from "../../services/auth";
import { getCurrentUser } from "../../services/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    // Check if user is admin
    const checkAdmin = async () => {
      try {
        const user = await getCurrentUser();

        // For non-admin users, restrict access to admin-only pages
        if (!user.is_admin) {
          // Allow access to regular dashboard page
          if (pathname !== "/dashboard") {
            router.push("/dashboard");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    checkAdmin();
  }, [router, pathname]);

  if (!isMounted || isCheckingAdmin) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Navigation />
        <div className="flex-1 overflow-auto">
          <main className="p-6 sm:p-10">
            <div className="flex justify-center items-center h-[80vh]">
              <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
            </div>
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
