"use client";

import { ReactNode } from "react";

import ProtectedRoute from "@/components/auth/protected-route";

import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {

  return (
    <ProtectedRoute>

      <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans">

        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">

          <Navbar />

          <main className="p-6 sm:p-8">
            {children}
          </main>

        </div>

      </div>

    </ProtectedRoute>
  );
}