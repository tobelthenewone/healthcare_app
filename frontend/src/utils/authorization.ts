import { UserRole }
  from "@/types/auth";

export function isPatient(
  role?: UserRole,
): boolean {

  return role === "PATIENT";
}

export function isProfessional(
  role?: UserRole,
): boolean {

  return role === "PROFESSIONAL";
}

export function isAdmin(
  role?: UserRole,
): boolean {

  return role === "ADMIN";
}