"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/auth-context";

export default function Navbar() {

  const router = useRouter();

  const {
    user,
    logout,
  } = useAuth();

  async function handleLogout() {

    await logout();

    router.push("/login");
  }

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">

      <div>
        <h1 className="font-semibold text-lg">
          Welcome {user?.fullName}
        </h1>

        <p className="text-sm text-gray-500">
          {user?.role}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="bg-black text-white px-4 py-2 rounded-md"
      >
        Logout
      </button>

    </header>
  );
}