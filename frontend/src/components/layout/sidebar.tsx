"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { usePathname } from "next/navigation";
import { isPatient, isProfessional, isAdmin } from "@/utils/authorization";

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const links: {
    href: string;
    label: string;
  }[] = [];

  if (isPatient(user?.role)) {
    links.push(
      {
        href: "/book",
        label: "Book Appointment",
      },
      {
        href: "/appointments",
        label: "My Appointments",
      },
      {
        label: "Medical History",
        href: "/patient/medical-history",
      },
      {
        label: "Profile",
        href: "/profile",
      },
    );
  }

  if (isProfessional(user?.role)) {
    links.push(
      {
        href: "/professional",
        label: "Professional Dashboard",
      },
      {
        href: "/schedule",
        label: "My Schedule",
      },
      {
        label: "Profile",
        href: "/professional/profile",
      },
    );
  }

  if (isAdmin(user?.role)) {
    links.push(
      {
        href: "/admin",
        label: "Admin Dashboard",
      },
      {
        href: "/admin/users",
        label: "Users",
      },
      {
        href: "/admin/appointments",
        label: "Appointments",
      },
      {
        href: "/admin/calendar",
        label: "Calendar",
      },
    );
  }

  return (
    <aside className="w-64 bg-black text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-8">Some cool App</h2>

      <nav className="space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                block px-4 py-2 rounded-md transition
                ${isActive ? "bg-white text-black" : "hover:bg-gray-800"}
              `}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
