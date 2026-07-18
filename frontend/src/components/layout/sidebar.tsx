"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { usePathname } from "next/navigation";
import { isPatient, isProfessional, isAdmin } from "@/utils/authorization";

interface SidebarLink {
  href: string;
  label: string;
  icon: ReactNode;
}

const iconProps = {
  className: "w-5 h-5",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 2,
} as const;

const icons = {
  book: (
    <svg {...iconProps}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  calendar: (
    <svg {...iconProps}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  history: (
    <svg {...iconProps}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  user: (
    <svg {...iconProps}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  grid: (
    <svg {...iconProps}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  ),
  users: (
    <svg {...iconProps}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-4.13a4 4 0 100-8 4 4 0 000 8zm6 0a4 4 0 10-8 0"
      />
    </svg>
  ),
};

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const links: SidebarLink[] = [];

  if (isPatient(user?.role)) {
    links.push(
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: icons.grid,
      },
      {
        href: "/patient/book",
        label: "Book Appointment",
        icon: icons.book,
      },
      {
        href: "/patient/appointments",
        label: "My Appointments",
        icon: icons.calendar,
      },
      {
        label: "Medical History",
        href: "/patient/medical-history",
        icon: icons.history,
      },
      {
        label: "Profile",
        href: "/patient/profile",
        icon: icons.user,
      },
    );
  }

  if (isProfessional(user?.role)) {
    links.push(
      {
        href: "/professional/dashboard-temp",
        label: "Dashboard",
        icon: icons.grid,
      },
      {
        href: "/professional/schedule",
        label: "My Schedule",
        icon: icons.calendar,
      },
      {
        label: "Profile",
        href: "/professional/profile-temp",
        icon: icons.user,
      },
    );
  }

  if (isAdmin(user?.role)) {
    links.push(
      {
        href: "/admin",
        label: "Admin Dashboard",
        icon: icons.grid,
      },
      {
        href: "/admin/users",
        label: "Users",
        icon: icons.users,
      },
      {
        href: "/admin/appointments",
        label: "Appointments",
        icon: icons.calendar,
      },
      {
        href: "/admin/calendar",
        label: "Calendar",
        icon: icons.calendar,
      },
    );
  }

  return (
    <aside className="w-64 shrink-0 min-h-screen bg-gradient-to-b from-slate-800 via-slate-900 to-indigo-950 text-white relative overflow-hidden flex flex-col p-6">
      {/* Ambient Glows */}
      <div className="absolute -top-32 -left-20 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl animate-drift-slow pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl animate-float-slow pointer-events-none" />

      {/* Logo & Header */}
      <div className="relative z-10 flex items-center gap-3 mb-10 px-1">
        <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
          <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.871 4A17.926 17.926 0 003 12c0 2.871.67 5.585 1.871 8m14.13 0a17.93 17.93 0 001.87-8c0-2.871-.67-5.585-1.87-8M9 9h1.246a1 1 0 01.961.725l1.586 5.55a1 1 0 00.961.725H15m1-7h-.08a2 2 0 00-1.513.692l-1.17 1.4a2 2 0 01-3.07 0l-1.17-1.4A2 2 0 006.58 8H6" />
          </svg>
        </div>
        <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
          HealthSync
        </span>
      </div>

      <nav className="relative z-10 space-y-1.5 flex-1">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 shadow-sm"
                    : "text-slate-300 border border-transparent hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <span className={isActive ? "text-emerald-400" : "text-slate-400"}>
                {link.icon}
              </span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="relative z-10 pt-4 mt-4 border-t border-slate-800/80 text-xs text-slate-500 px-1">
        &copy; {new Date().getFullYear()} HealthSync
      </div>
    </aside>
  );
}
