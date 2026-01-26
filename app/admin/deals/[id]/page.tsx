"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Deal {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  productUrl: string;
  originalPrice: number;
  currentPrice: number;
  discount: number;
  primaryImage?: string;
  status: string;
}

export default function EditDealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [dealId, setDealId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deal, setDeal] = useState<Deal | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Get the deal ID from params
  useEffect(() => {
    params.then((p) => setDealId(p.id));
  }, [params]);

  // Fetch deal and categories
  useEffect(() => {
    if (!dealId) return;

    Promise.all([
      fetch(`/api/admin/deals/${dealId}`),
      fetch(`/api/admin/categories`),
    ]).then(([dealRes, catRes]) => {
      if (dealRes.ok) {
        dealRes.json().then((d) => {
          setDeal(d);
          if (d.primaryImage) {
            setImagePreview(d.primaryImage);
          }
        });
      }
      if (catRes.ok) {
        catRes.json().then(setCategories);
      }
      setLoading(false);
    });
  }, [dealId]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!deal) return;

    setSaving(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data: any = {
      title: formData.get("title"),
      description: formData.get("description"),
      categoryId: formData.get("categoryId"),
      url: formData.get("url"),
      originalPrice: formData.get("originalPrice"),
      currentPrice: formData.get("currentPrice"),
      discount: formData.get("discount"),
      status: formData.get("status"),
    };

    // Add image if provided
    if (imagePreview && imagePreview !== deal.primaryImage) {
      data.image = imagePreview;
    }

    try {
      const response = await fetch(`/api/admin/deals/${dealId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update deal");

      router.push("/admin/deals");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 mb-4">Deal not found</p>
        <Link href="/admin/deals" className="text-primary hover:underline">
          Back to Deals
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/admin/deals"
          className="text-primary hover:underline text-sm mb-4 inline-block"
        >
          ← Back to Deals
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Deal</h1>
        <p className="text-gray-600 mt-1">Update deal information</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              defaultValue={deal.title}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              defaultValue={deal.description}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="categoryId"
              defaultValue={deal.categoryId}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 w-40 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product URL
            </label>
            <input
              type="url"
              name="url"
              defaultValue={deal.productUrl}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Original Price
              </label>
              <input
                type="number"
                name="originalPrice"
                step="0.01"
                defaultValue={deal.originalPrice}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Price
              </label>
              <input
                type="number"
                name="currentPrice"
                step="0.01"
                defaultValue={deal.currentPrice}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Discount %
              </label>
              <input
                type="number"
                name="discount"
                defaultValue={deal.discount}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              defaultValue={deal.status}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link
            href="/admin/deals"
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
