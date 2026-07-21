"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import RoleGuard from "@/components/auth/role-guard";
import PageHeader from "@/components/ui/page-header";
import LoadingState from "@/components/ui/loading-state";
import EmptyState from "@/components/ui/empty-state";
import adminService from "@/services/admin-service";

import { UserProfileResponse } from "@/types/admin";

const roleFilters = ["ALL", "PATIENT", "PROFESSIONAL", "ADMIN"] as const;

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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfileResponse[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState<(typeof roleFilters)[number]>("ALL");

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

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

      const matchesQuery =
        !query ||
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      return matchesRole && matchesQuery;
    });
  }, [users, search, roleFilter]);

  if (loading) {
    return <LoadingState label="Loading users..." />;
  }

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div>
        <PageHeader
          eyebrow="User Management"
          title="Users"
          subtitle={`${users.length} registered ${users.length === 1 ? "account" : "accounts"} across all roles.`}
        />

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="block w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {roleFilters.map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`
                  px-4 py-2.5 rounded-2xl text-xs font-semibold border transition-all duration-200 cursor-pointer
                  ${roleFilter === role
                    ? "bg-gradient-to-r from-emerald-600 to-teal-500 border-transparent text-white shadow-md shadow-emerald-500/20"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-200 dark:hover:border-emerald-500/30"
                  }
                `}
              >
                {role === "ALL" ? "All" : role.charAt(0) + role.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <EmptyState
            title="No users found"
            description="Try adjusting your search or role filter."
          />
        ) : (
          <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 text-left">
                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">
                      Email
                    </th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                            {getInitials(user.fullName) || "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 dark:text-white truncate">
                              {user.fullName}
                            </p>
                            <p className="text-xs text-slate-400 md:hidden truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 hidden md:table-cell">
                        {user.email}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRoleClasses(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
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
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-3.5 py-2 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
                        >
                          View
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
