"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Feature {
  id: string;
  title: string;
  icon: string | null;
  description: string;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
  color: string | null;
  backgroundColor: string | null;
  linkUrl: string | null;
  linkText: string | null;
  image: string | null;
  featureGroupId: string | null;
}

const PREDEFINED_ICONS = [
  { value: "🔥", label: "Fire" },
  { value: "⚡", label: "Lightning" },
  { value: "💰", label: "Money" },
  { value: "🏷️", label: "Tag" },
  { value: "📦", label: "Package" },
  { value: "🎁", label: "Gift" },
  { value: "⭐", label: "Star" },
  { value: "💎", label: "Diamond" },
  { value: "🚀", label: "Rocket" },
  { value: "💡", label: "Idea" },
  { value: "🔔", label: "Bell" },
  { value: "📊", label: "Chart" },
  { value: "🛡️", label: "Shield" },
  { value: "🔒", label: "Lock" },
  { value: "❤️", label: "Heart" },
  { value: "👍", label: "Thumbs Up" },
  { value: "🎯", label: "Target" },
  { value: "🏆", label: "Trophy" },
  { value: "📱", label: "Phone" },
  { value: "💻", label: "Laptop" },
  { value: "🌐", label: "Globe" },
  { value: "🔗", label: "Link" },
  { value: "⚙️", label: "Gear" },
  { value: "✅", label: "Check" },
];

export default function EditFeature() {
  const params = useParams();
  const router = useRouter();
  const featureId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<Feature>({
    id: "",
    title: "",
    icon: "",
    description: "",
    order: 0,
    isActive: true,
    isFeatured: false,
    color: "",
    backgroundColor: "",
    linkUrl: "",
    linkText: "",
    image: "",
    featureGroupId: null,
  });

  useEffect(() => {
    async function fetchFeature() {
      try {
        const response = await fetch(`/api/admin/features/${featureId}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            ...data,
            linkUrl: data.linkUrl || "",
            linkText: data.linkText || "",
            image: data.image || "",
            color: data.color || "",
            backgroundColor: data.backgroundColor || "",
          });
        } else {
          setError("Failed to load feature");
        }
      } catch (err) {
        console.error("Failed to fetch feature:", err);
        setError("Failed to load feature");
      } finally {
        setLoading(false);
      }
    }

    if (featureId) {
      fetchFeature();
    }
  }, [featureId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/features/${featureId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccess("Feature updated successfully!");
        router.refresh();
      } else {
        setError(responseData.error || "Failed to update feature");
      }
    } catch (err) {
      console.error("Failed to update feature:", err);
      setError("Failed to update feature");
    } finally {
      setSaving(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Feature</h1>
          <p className="text-gray-600 mt-1">Update feature details</p>
        </div>
        <Link
          href="/admin/features"
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          ← Back to Features
        </Link>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Feature Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Feature title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <div className="flex gap-2 flex-wrap">
                {PREDEFINED_ICONS.map((icon) => (
                  <button
                    key={icon.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, icon: icon.value }))
                    }
                    className={`w-10 h-10 text-xl rounded-lg border-2 transition ${
                      formData.icon === icon.value
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    title={icon.label}
                  >
                    {icon.value}
                  </button>
                ))}
              </div>
              <input
                type="text"
                name="icon"
                value={formData.icon || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mt-2"
                placeholder="Or enter custom emoji"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Feature description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Styling</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon Color
              </label>
              <input
                type="color"
                name="color"
                value={formData.color || "#000000"}
                onChange={handleChange}
                className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <input
                type="color"
                name="backgroundColor"
                value={formData.backgroundColor || "#f3f4f6"}
                onChange={handleChange}
                className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Link</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link URL
              </label>
              <input
                type="url"
                name="linkUrl"
                value={formData.linkUrl || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link Text
              </label>
              <input
                type="text"
                name="linkText"
                value={formData.linkText || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Learn More"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">
                Featured
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/features"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Feature"}
          </button>
        </div>
      </form>
    </div>
  );
}
