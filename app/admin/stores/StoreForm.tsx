"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface StoreFormProps {
  initialData?: {
    id?: string;
    name: string;
    slug: string;
    logo: string;
    isActive: boolean;
  };
}

export default function StoreForm({ initialData }: StoreFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEditing = !!initialData?.id;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      logo: formData.get("logo"),
      isActive: formData.get("isActive") === "on",
    };

    try {
      const url = isEditing
        ? `/api/admin/stores/${initialData.id}`
        : "/api/admin/stores";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save store");

      router.push("/admin/stores");
      router.refresh();
    } catch (err) {
      setError("Error saving store. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Store Name
        </label>
        <input
          type="text"
          name="name"
          required
          defaultValue={initialData?.name}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Slug</label>
        <input
          type="text"
          name="slug"
          required
          defaultValue={initialData?.slug}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Logo URL</label>
        <input
          type="url"
          name="logo"
          required
          defaultValue={initialData?.logo}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="isActive"
          id="isActive"
          defaultChecked={initialData?.isActive ?? true}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
          Active
        </label>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : isEditing ? "Update Store" : "Create Store"}
        </button>
        <a
          href="/admin/stores"
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
