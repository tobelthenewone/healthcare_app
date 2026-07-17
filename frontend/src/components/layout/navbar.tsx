"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/auth-context";

export default function Navbar() {

  const router = useRouter();

  const {
    user,
    logout,
  } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await logout();

      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  }

  const initials = (user?.fullName ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <header className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-20">

      <div>
        <h1 className="font-semibold text-lg text-slate-900 dark:text-white">
          Welcome{user?.fullName ? `, ${user.fullName}` : ""}
        </h1>

        {user?.role && (
          <span className="inline-block mt-1 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-full">
            {user.role}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 items-center justify-center text-white font-semibold text-xs shadow-md shadow-emerald-500/20">
          {initials || "?"}
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 dark:hover:border-rose-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>

    </header>
  );
}
