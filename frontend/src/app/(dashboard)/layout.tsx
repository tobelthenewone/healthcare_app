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

      <div className="min-h-screen flex bg-gray-100">

        <Sidebar />

        <div className="flex-1 flex flex-col">

          <Navbar />

          <main className="p-6">
            {children}
          </main>

        </div>

      </div>

    </ProtectedRoute>
  );
}