"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/book",
    label: "Book Appointment",
  },
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    href: "/appointments",
    label: "Appointments",
  },
  {
    href: "/profile",
    label: "Profile",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

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
