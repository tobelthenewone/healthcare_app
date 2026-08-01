"use client";

import { useEffect, useState } from "react";

import {
  CalendarDays,
  ClipboardList,
  Clock3,
  Stethoscope,
  Users,
  UserRound,
  CircleCheckBig,
} from "lucide-react";

import { useAuth } from "@/context/auth-context";

import { dashboardService } from "@/services/dashboard-service";

import {
  AdminDashboard,
  PatientDashboard,
  ProfessionalDashboard,
} from "@/types/dashboard";

import PageHeader from "@/components/ui/page-header";
import LoadingState from "@/components/ui/loading-state";

import StatCard from "@/components/dashboard/stat-card";
import ActionCard from "@/components/dashboard/action-card";

export default function DashboardPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [patientStats, setPatientStats] = useState<PatientDashboard | null>(
    null,
  );

  const [professionalStats, setProfessionalStats] =
    useState<ProfessionalDashboard | null>(null);

  const [adminStats, setAdminStats] = useState<AdminDashboard | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        if (user?.role === "PATIENT") {
          setPatientStats(await dashboardService.getPatientDashboard());
        }

        if (user?.role === "PROFESSIONAL") {
          setProfessionalStats(
            await dashboardService.getProfessionalDashboard(),
          );
        }

        if (user?.role === "ADMIN") {
          setAdminStats(await dashboardService.getAdminDashboard());
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadDashboard();
    }
  }, [user]);

  if (loading) {
    return <LoadingState label="Loading dashboard..." />;
  }
  return (
    <div>
      <PageHeader
        eyebrow={user?.role}
        title={`Welcome back, ${user?.fullName?.split(" ")[0]} 👋`}
        subtitle="Here's an overview of your healthcare dashboard."
      />

      {/* ================= PATIENT ================= */}

      {user?.role === "PATIENT" && patientStats && (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <StatCard
              title="Upcoming Appointments"
              value={patientStats.upcomingAppointments}
              icon={<CalendarDays className="w-7 h-7 text-emerald-600" />}
              color="bg-emerald-50 dark:bg-emerald-500/10"
            />

            <StatCard
              title="Completed"
              value={patientStats.completedAppointments}
              icon={<CircleCheckBig className="w-7 h-7 text-blue-600" />}
              color="bg-blue-50 dark:bg-blue-500/10"
            />

            <StatCard
              title="Medical Records"
              value={patientStats.consultationRecords}
              icon={<ClipboardList className="w-7 h-7 text-purple-600" />}
              color="bg-purple-50 dark:bg-purple-500/10"
            />
          </div>
        </>
      )}

      {/* ================= PROFESSIONAL ================= */}

      {user?.role === "PROFESSIONAL" && professionalStats && (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <StatCard
              title="Today's Appointments"
              value={professionalStats.todayAppointments}
              icon={<CalendarDays className="w-7 h-7 text-emerald-600" />}
              color="bg-emerald-50 dark:bg-emerald-500/10"
            />

            <StatCard
              title="Pending"
              value={professionalStats.pendingAppointments}
              icon={<Clock3 className="w-7 h-7 text-amber-600" />}
              color="bg-amber-50 dark:bg-amber-500/10"
            />

            <StatCard
              title="Completed"
              value={professionalStats.completedAppointments}
              icon={<CircleCheckBig className="w-7 h-7 text-blue-600" />}
              color="bg-blue-50 dark:bg-blue-500/10"
            />
          </div>
        </>
      )}

      {/* ================= ADMIN ================= */}

      {user?.role === "ADMIN" && adminStats && (
        <>
          <div className="grid gap-6 md:grid-cols-4">
            <StatCard
              title="Users"
              value={adminStats.totalUsers}
              icon={<Users className="w-7 h-7 text-indigo-600" />}
              color="bg-indigo-50 dark:bg-indigo-500/10"
            />

            <StatCard
              title="Patients"
              value={adminStats.totalPatients}
              icon={<UserRound className="w-7 h-7 text-emerald-600" />}
              color="bg-emerald-50 dark:bg-emerald-500/10"
            />

            <StatCard
              title="Professionals"
              value={adminStats.totalProfessionals}
              icon={<Stethoscope className="w-7 h-7 text-cyan-600" />}
              color="bg-cyan-50 dark:bg-cyan-500/10"
            />

            <StatCard
              title="Appointments"
              value={adminStats.totalAppointments}
              icon={<CalendarDays className="w-7 h-7 text-purple-600" />}
              color="bg-purple-50 dark:bg-purple-500/10"
            />
          </div>
        </>
      )}
      {user?.role === "PATIENT" && (
        <div className="grid gap-5 md:grid-cols-3">
          <ActionCard
            title="Book Appointment"
            subtitle="Find a healthcare professional"
            href="/patient/book"
            icon={<CalendarDays size={22} />}
          />

          <ActionCard
            title="Medical History"
            subtitle="View your consultations"
            href="/patient/medical-history"
            icon={<ClipboardList size={22} />}
          />

          <ActionCard
            title="My Profile"
            subtitle="Update your personal information"
            href="/patient/profile"
            icon={<UserRound size={22} />}
          />
        </div>
      )}

      {user?.role === "PROFESSIONAL" && (
        <div className="grid gap-5 md:grid-cols-3">
          <ActionCard
            title="Dashboard"
            subtitle="View today's appointments"
            href="/professional/dashboard-temp"
            icon={<CalendarDays size={22} />}
          />

          <ActionCard
            title="My Schedule"
            subtitle="Manage your availability"
            href="/professional/Schedule"
            icon={<Clock3 size={22} />}
          />

          <ActionCard
            title="Professional Profile"
            subtitle="Update specialties and description"
            href="/professional/Profile"
            icon={<Stethoscope size={22} />}
          />
        </div>
      )}

      {user?.role === "ADMIN" && (
        <div className="grid gap-5 md:grid-cols-3">
          <ActionCard
            title="Manage Users"
            subtitle="Patients & Professionals"
            href="/admin/users"
            icon={<Users size={22} />}
          />

          <ActionCard
            title="Appointments"
            subtitle="Manage appointments"
            href="/admin/appointments"
            icon={<CalendarDays size={22} />}
          />

          <ActionCard
            title="Calendar"
            subtitle="View appointment calendar"
            href="/admin/calendar"
            icon={<ClipboardList size={22} />}
          />
        </div>
      )}
    </div>
  );
}
