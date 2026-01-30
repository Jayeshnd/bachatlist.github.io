"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Section {
  sectionKey: string;
  title: string;
  content: string | null;
  image: string | null;
  imagePosition: string;
  order: number;
  isActive: boolean;
}

interface TeamMember {
  id?: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  socialLinks: string;
  order: number;
  isActive: boolean;
}

interface AboutData {
  sections: Section[];
  teamMembers: TeamMember[];
}

export default function AboutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [data, setData] = useState<AboutData>({
    sections: [],
    teamMembers: [],
  });

  const [newTeamMember, setNewTeamMember] = useState<TeamMember>({
    name: "",
    role: "",
    bio: "",
    image: "",
    socialLinks: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    async function fetchAboutData() {
      try {
        const response = await fetch("/api/admin/about");
        if (response.ok) {
          const responseData = await response.json();
          setData({
            sections: responseData.sections || [],
            teamMembers: responseData.teamMembers || [],
          });
        } else {
          setError("Failed to load about content");
        }
      } catch (err) {
        console.error("Failed to fetch about data:", err);
        setError("Failed to load about content");
      } finally {
        setLoading(false);
      }
    }

    fetchAboutData();
  }, []);

  async function handleSaveSections() {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: data.sections }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccess("Sections saved successfully!");
        router.refresh();
      } else {
        setError(responseData.error || "Failed to save sections");
      }
    } catch (err) {
      console.error("Failed to save sections:", err);
      setError("Failed to save sections");
    } finally {
      setSaving(false);
    }
  }

  function updateSection(
    sectionKey: string,
    field: string,
    value: string | number | boolean
  ) {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.sectionKey === sectionKey
          ? { ...section, [field]: value }
          : section
      ),
    }));
  }

  function addTeamMember() {
    if (!newTeamMember.name || !newTeamMember.role) {
      setError("Name and role are required");
      return;
    }

    setData((prev) => ({
      ...prev,
      teamMembers: [
        ...prev.teamMembers,
        { ...newTeamMember, id: `temp-${Date.now()}` },
      ],
    }));

    setNewTeamMember({
      name: "",
      role: "",
      bio: "",
      image: "",
      socialLinks: "",
      order: 0,
      isActive: true,
    });
  }

  function removeTeamMember(index: number) {
    setData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index),
    }));
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">About Page</h1>
          <p className="text-gray-600 mt-1">Manage about page content</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-6">
        {data.sections.map((section) => (
          <div
            key={section.sectionKey}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                {section.sectionKey.replace(/_/g, " ")}
              </h2>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={section.isActive}
                  onChange={(e) =>
                    updateSection(section.sectionKey, "isActive", e.target.checked)
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-600">Active</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) =>
                    updateSection(section.sectionKey, "title", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={section.image || ""}
                  onChange={(e) =>
                    updateSection(section.sectionKey, "image", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={section.content || ""}
                  onChange={(e) =>
                    updateSection(section.sectionKey, "content", e.target.value)
                  }
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Team Members */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h2>

          {data.teamMembers.length > 0 && (
            <div className="mb-6 space-y-4">
              {data.teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {member.image && (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTeamMember(index)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              Add Team Member
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={newTeamMember.name}
                  onChange={(e) =>
                    setNewTeamMember((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <input
                  type="text"
                  value={newTeamMember.role}
                  onChange={(e) =>
                    setNewTeamMember((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="CEO"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={newTeamMember.image}
                  onChange={(e) =>
                    setNewTeamMember((prev) => ({ ...prev, image: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <input
                  type="text"
                  value={newTeamMember.bio}
                  onChange={(e) =>
                    setNewTeamMember((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Short bio..."
                />
              </div>
            </div>

            <button
              type="button"
              onClick={addTeamMember}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Add Team Member
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveSections}
            disabled={saving}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
