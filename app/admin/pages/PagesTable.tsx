"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Page {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

interface PagesTableProps {
  initialPages: Page[];
}

export function PagesTable({ initialPages }: PagesTableProps) {
  const [pages, setPages] = useState(initialPages);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggleStatus(pageId: string, currentStatus: string) {
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setPages(
          pages.map((page) =>
            page.id === pageId ? { ...page, status: newStatus } : page
          )
        );
        router.refresh();
      } else {
        alert(`Error: ${responseData.error || "Failed to update status"}`);
      }
    } catch (error) {
      console.error("Failed to update page status:", error);
      alert("Failed to update page status");
    } finally {
      setLoading(false);
    }
  }

  async function deletePage(pageId: string) {
    if (!window.confirm("Are you sure you want to delete this page?")) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPages(pages.filter((page) => page.id !== pageId));
        alert("Page deleted successfully");
        router.refresh();
      } else {
        const responseData = await response.json();
        alert(`Error: ${responseData.error || "Failed to delete page"}`);
      }
    } catch (error) {
      console.error("Failed to delete page:", error);
      alert("Failed to delete page");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Title
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Slug
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Created At
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {pages.map((page) => (
            <tr key={page.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <p className="font-medium text-gray-900">{page.title}</p>
              </td>
              <td className="px-6 py-4 text-gray-600">
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  /{page.slug}
                </code>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => toggleStatus(page.id, page.status)}
                  disabled={loading}
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:opacity-80 transition ${
                    page.status === "PUBLISHED"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {page.status}
                </button>
              </td>
              <td className="px-6 py-4 text-gray-600">
                {formatDate(page.createdAt)}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-3">
                  <Link
                    href={`/admin/pages/${page.id}`}
                    className="text-primary hover:underline text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deletePage(page.id)}
                    disabled={loading}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
