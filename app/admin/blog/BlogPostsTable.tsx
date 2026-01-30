"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  authorName: string | null;
  category: { id: string; name: string } | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  isFeatured: boolean;
}

interface BlogPostsTableProps {
  initialPosts: BlogPost[];
}

export function BlogPostsTable({ initialPosts }: BlogPostsTableProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggleStatus(postId: string, currentStatus: string) {
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setPosts(
          posts.map((post) =>
            post.id === postId ? { ...post, status: newStatus } : post
          )
        );
        router.refresh();
      } else {
        alert(`Error: ${responseData.error || "Failed to update status"}`);
      }
    } catch (error) {
      console.error("Failed to update post status:", error);
      alert("Failed to update post status");
    } finally {
      setLoading(false);
    }
  }

  async function deletePost(postId: string) {
    if (!window.confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== postId));
        alert("Blog post deleted successfully");
        router.refresh();
      } else {
        const responseData = await response.json();
        alert(`Error: ${responseData.error || "Failed to delete post"}`);
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post");
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
              Author
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Category
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Published
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {post.isFeatured && (
                    <span className="text-yellow-500" title="Featured">
                      ⭐
                    </span>
                  )}
                  <p className="font-medium text-gray-900">{post.title}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600">
                {post.authorName || "Unknown"}
              </td>
              <td className="px-6 py-4 text-gray-600">
                {post.category?.name || "Uncategorized"}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => toggleStatus(post.id, post.status)}
                  disabled={loading}
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:opacity-80 transition ${
                    post.status === "PUBLISHED"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {post.status}
                </button>
              </td>
              <td className="px-6 py-4 text-gray-600">
                {formatDate(post.publishedAt)}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-3">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="text-primary hover:underline text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deletePost(post.id)}
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
