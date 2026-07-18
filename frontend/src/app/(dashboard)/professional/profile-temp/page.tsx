"use client";

import { useEffect, useState } from "react";

import RoleGuard from "@/components/auth/role-guard";
import {
  professionalProfileService,
  ProfessionalProfileResponse,
} from "@/services/professional-profile-service";

import PageHeader from "@/components/ui/page-header";
import LoadingState from "@/components/ui/loading-state";

import {
  UserCircleIcon,
  AcademicCapIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export default function ProfessionalProfilePage() {
  const [profile, setProfile] = useState<ProfessionalProfileResponse | null>(
    null,
  );

  const [specialties, setSpecialties] = useState("");

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  async function loadProfile() {
    try {
      const data = await professionalProfileService.getProfile();

      setProfile(data);

      setSpecialties(data.specialties ?? "");

      setDescription(data.description ?? "");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);

    try {
      const updated = await professionalProfileService.updateProfile({
        specialties,
        description,
      });

      setProfile(updated);

      alert("Profile updated successfully.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState label="Loading profile..." />;
  }

  return (
    <RoleGuard allowedRoles={["PROFESSIONAL"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Professional"
          title="My Profile"
          subtitle="Manage your public professional information."
        />

        <div className="bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center">
              <UserCircleIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Account Information
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your personal account details.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 p-6 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Full Name
              </p>

              <p className="mt-1 text-slate-900 dark:text-white">
                {profile?.fullName}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email
              </p>

              <p className="mt-1 text-slate-900 dark:text-white">
                {profile?.email}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Specialties
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Add your medical specialties.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 p-6">
              <input
                value={specialties}
                onChange={(e) => setSpecialties(e.target.value)}
                placeholder="General Practitioner, Family Medicine..."
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Professional Description
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tell patients about your background and experience.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 p-6">
              <textarea
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell patients about your experience..."
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="
            text-sm
            font-semibold
            px-6
            py-3
            rounded-xl
            shadow-md
            active:scale-[0.98]
            transition-all
            duration-200
            disabled:opacity-50
            disabled:cursor-not-allowed
            bg-gradient-to-r
            from-emerald-600
            to-teal-500
            hover:from-emerald-500
            hover:to-teal-400
            text-white
            shadow-emerald-500/20
          "
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </RoleGuard>
  );
}
