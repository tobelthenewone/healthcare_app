"use client";

import {
  ReactNode,
} from "react";

import { useRouter }
  from "next/navigation";

import { useAuth }
  from "@/context/auth-context";

import { UserRole }
  from "@/types/auth";

interface RoleGuardProps {

  allowedRoles: UserRole[];

  children: ReactNode;
}

export default function RoleGuard({
  allowedRoles,
  children,
}: RoleGuardProps) {

  const { user, loading } =
    useAuth();

  const router = useRouter();

  if (loading) {

    return <div>Loading...</div>;
  }

  if (
    !user ||
    !allowedRoles.includes(user.role)
  ) {

    router.push("/login");

    return null;
  }

  return children;
}