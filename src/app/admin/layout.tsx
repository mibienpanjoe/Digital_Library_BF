"use client";

import { useAuth } from "@/hooks/useAuth";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar />
      <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
