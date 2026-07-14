"use client";

import { FormEvent, useEffect, useState } from "react";

import RoleGuard from "@/components/auth/role-guard";

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
    return <div>Loading...</div>;
  }

  return (
    <RoleGuard allowedRoles={["PATIENT"]}>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Patient Profile</h1>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="space-y-2 mb-8">
            <p>
              <strong>Name:</strong> {profile?.fullName}
            </p>

            <p>
              <strong>Email:</strong> {profile?.email}
            </p>

            <p>
              <strong>Phone:</strong> {profile?.phone}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">Date of Birth</label>

              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full border rounded-md p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Blood Group</label>

              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full border rounded-md p-3"
              >
                <option value="">Select Blood Group</option>

                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">Allergies</label>

              <textarea
                rows={4}
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="w-full border rounded-md p-3"
                placeholder="List any known allergies..."
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Medical Notes</label>

              <textarea
                rows={6}
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                className="w-full border rounded-md p-3"
                placeholder="Relevant medical history..."
              />
            </div>
            {success && <p className="text-green-600 font-medium">{success}</p>}
            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white px-6 py-3 rounded-md"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </RoleGuard>
  );
}
