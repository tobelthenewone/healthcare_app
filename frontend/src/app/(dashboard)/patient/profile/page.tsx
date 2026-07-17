"use client";

import { FormEvent, useEffect, useState } from "react";

import RoleGuard from "@/components/auth/role-guard";
import PageHeader from "@/components/ui/page-header";
import LoadingState from "@/components/ui/loading-state";

import {
  patientProfileService,
  PatientProfileResponse,
} from "@/services/patient-profile-service";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function PatientProfilePage() {
  const [profile, setProfile] = useState<PatientProfileResponse | null>(null);

  const [dateOfBirth, setDateOfBirth] = useState("");

  const [bloodGroup, setBloodGroup] = useState("");

  const [allergies, setAllergies] = useState("");

  const [medicalNotes, setMedicalNotes] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  async function loadProfile() {
    try {
      const data = await patientProfileService.getProfile();

      setProfile(data);

      setDateOfBirth(data.dateOfBirth ?? "");

      setBloodGroup(data.bloodGroup ?? "");

      setAllergies(data.allergies ?? "");

      setMedicalNotes(data.medicalNotes ?? "");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const initialize = async () => {
      await loadProfile();
    };

    initialize();
  }, []);
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);
    setSuccess("");

    try {
      const updated = await patientProfileService.updateProfile({
        dateOfBirth: dateOfBirth || null,
        bloodGroup: bloodGroup || null,
        allergies,
        medicalNotes,
      });

      setProfile(updated);

      setSuccess("Profile updated successfully.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState label="Loading your profile..." />;
  }

  const initials = (profile?.fullName ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <RoleGuard allowedRoles={["PATIENT"]}>
      <div className="max-w-3xl">
        <PageHeader
          eyebrow="Account"
          title="Patient Profile"
          subtitle="Keep your personal and medical details up to date for accurate care."
        />

        <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-8">
          <div className="flex items-center gap-4 pb-8 mb-8 border-b border-slate-100 dark:border-slate-800">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/20">
              {initials || "?"}
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-slate-900 dark:text-white">
                {profile?.fullName}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {profile?.email}
              </p>
              {profile?.phone && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {profile.phone}
                </p>
              )}
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl flex items-start gap-3">
              <svg
                className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                {success}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm"
                >
                  <option value="">Select Blood Group</option>

                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Allergies
              </label>
              <textarea
                rows={3}
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm resize-none"
                placeholder="List any known allergies..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Medical Notes
              </label>
              <textarea
                rows={5}
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm resize-none"
                placeholder="Relevant medical history..."
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </div>
      </div>
    </RoleGuard>
  );
}
