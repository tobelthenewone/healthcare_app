"use client";

import { useEffect, useState } from "react";
import RoleGuard from "@/components/auth/role-guard";
import adminService from "@/services/admin-service";

import { UserProfileResponse } from "@/types/admin";
import Link from "next/dist/client/link";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfileResponse[]>([]);

  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    try {
      const data = await adminService.getUsers();

      setUsers(data);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function initialize() {
      await loadUsers();
    }

    initialize();
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div>
        <h1 className="text-3xl text-black font-bold mb-6">Users</h1>

        <div className="overflow-x-auto">
          <table className="w-full border text-black">
            <thead>
              <tr className="bg-black text-white">
                <th className="border p-2">ID</th>

                <th className="border p-2">Full Name</th>

                <th className="border p-2">Email</th>

                <th className="border p-2">Role</th>

                <th className="border p-2">Enabled</th>

                <th className="border p-2">Actions</th>
                
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="border p-2">{user.id}</td>

                  <td className="border p-2">{user.fullName}</td>

                  <td className="border p-2">{user.email}</td>

                  <td className="border p-2">{user.role}</td>

                  <td className="border p-2">
                    {user.enabled ? "✅ Enabled" : "❌ Disabled"}
                  </td>
                  <td className="border p-2">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="bg-black text-white px-3 py-1 rounded"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RoleGuard>
  );
}
