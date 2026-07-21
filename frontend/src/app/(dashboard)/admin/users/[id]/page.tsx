"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { use } from "react";

import adminService from "@/services/admin-service";

import { UserProfileResponse } from "@/types/admin";
import PageHeader from "@/components/ui/page-header";
import LoadingState from "@/components/ui/loading-state";
import EmptyState from "@/components/ui/empty-state";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

function getRoleClasses(role: string) {
  switch (role) {
    case "ADMIN":
      return "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20";
    case "PROFESSIONAL":
      return "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20";
    case "PATIENT":
      return "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
    default:
      return "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
  }
}

function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function UserDetailsPage({ params }: Props) {
  const { id } = use(params);
  const [user, setUser] = useState<UserProfileResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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
      setUpdating(true);

      const updatedUser = await adminService.updateUserStatus(
        user.id,
        enabled,
      );

      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update user", error);

      alert("Failed to update user");
    } finally {
      setUpdating(false);
    }
  }
  useEffect(() => {
    async function initialize() {
      await loadUser();
    }

    initialize();
  }, []);

  if (loading) {
    return <LoadingState label="Loading user..." />;
  }

  if (!user) {
    return (
      <EmptyState
        title="User not found"
        description="This account may have been removed or the link is incorrect."
      />
    );
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition mb-6"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Users
      </Link>

      <PageHeader eyebrow="User Management" title="User Details" />

      <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-8">
        <div className="flex items-center gap-4 pb-8 mb-8 border-b border-slate-100 dark:border-slate-800">
          <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/20">
            {getInitials(user.fullName) || "?"}
          </div>
          <div>
            <p className="font-semibold text-lg text-slate-900 dark:text-white">
              {user.fullName}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {user.email}
            </p>
          </div>
        </div>

        <dl className="grid sm:grid-cols-2 gap-6 mb-8">
          <div>
            <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              User ID
            </dt>
            <dd className="text-sm font-medium text-slate-900 dark:text-white">
              #{user.id}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Role
            </dt>
            <dd>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRoleClasses(user.role)}`}
              >
                {user.role}
              </span>
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Full Name
            </dt>
            <dd className="text-sm font-medium text-slate-900 dark:text-white">
              {user.fullName}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Account Status
            </dt>
            <dd>
              <span
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border
                  ${user.enabled
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                    : "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                  }
                `}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${user.enabled ? "bg-emerald-500" : "bg-rose-500"}`}
                />
                {user.enabled ? "Enabled" : "Disabled"}
              </span>
            </dd>
          </div>
        </dl>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          {user.enabled ? (
            <button
              onClick={() => updateStatus(false)}
              disabled={updating}
              className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 px-5 py-2.5 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {updating && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {updating ? "Disabling..." : "Disable User"}
            </button>
          ) : (
            <button
              onClick={() => updateStatus(true)}
              disabled={updating}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 px-5 py-2.5 rounded-xl shadow-md shadow-emerald-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {updating && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {updating ? "Enabling..." : "Enable User"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
