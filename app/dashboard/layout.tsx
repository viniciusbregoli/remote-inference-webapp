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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    // Check authentication and role
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();

        // Restrict access to admin-only pages for regular users
        if (!user.is_admin) {
          const adminOnlyPaths = ["/dashboard/users", "/dashboard/api-keys"];

          if (adminOnlyPaths.includes(pathname)) {
            router.push("/dashboard");
          }
        }

        // Redirect admin users trying to access regular user pages
        if (user.is_admin) {
          if (pathname === "/dashboard/my-api-keys") {
            router.push("/dashboard/api-keys");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/login");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (!isMounted || isCheckingAuth) {
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
