"use client";

import { useEffect, useState } from "react";

import RoleGuard from "@/components/auth/role-guard";
import {
  professionalProfileService,
  ProfessionalProfileResponse,
} from "@/services/professional-profile-service";

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
    return <div>Loading...</div>;
  }

  return (
    <RoleGuard allowedRoles={["PROFESSIONAL"]}>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Professional Profile</h1>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="space-y-2 mb-8">
            <p>
              <strong>Name:</strong> {profile?.fullName}
            </p>

            <p>
              <strong>Email:</strong> {profile?.email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">Specialties</label>

              <input
                value={specialties}
                onChange={(e) => setSpecialties(e.target.value)}
                className="w-full border rounded-md p-3"
                placeholder="General Practitioner, Family Medicine"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Professional Description
              </label>

              <textarea
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-md p-3"
                placeholder="Tell patients about your experience..."
              />
            </div>

            <button
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
