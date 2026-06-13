"use client";

import { useEffect, useState } from "react";

import adminService from "@/services/admin-service";

import { UserProfileResponse } from "@/types/admin";
import { use } from "react";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function UserDetailsPage({ params }: Props) {
  const { id } = use(params);
  const [user, setUser] = useState<UserProfileResponse | null>(null);

  const [loading, setLoading] = useState(true);

  async function loadUser() {
    try {
      const data = await adminService.getUserById(Number(id));

      setUser(data);
    } catch (error) {
      console.error("Failed to load user", error);
    } finally {
      setLoading(false);
    }
  }
  async function updateStatus(enabled: boolean) {
    if (!user) {
      return;
    }

    try {
      const updatedUser = await adminService.updateUserStatus(user.id, enabled);

      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update user", error);

      alert("Failed to update user");
    }
  }
  useEffect(() => {
    async function initialize() {
      await loadUser();
    }

    initialize();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl text-black font-bold">User Details</h1>

      <div className="border text-black rounded-lg p-4">
        <p>
          <strong>ID:</strong> {user.id}
        </p>

        <p>
          <strong>Name:</strong> {user.fullName}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Role:</strong> {user.role}
        </p>

        <p>
          <strong>Enabled:</strong>{" "}
          {user.enabled ? "✅ Enabled" : "❌ Disabled"}
        </p>

        <div className="pt-4">
          {user.enabled ? (
            <button
              onClick={() => updateStatus(false)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Disable User
            </button>
          ) : (
            <button
              onClick={() => updateStatus(true)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Enable User
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
