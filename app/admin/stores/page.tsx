import { prisma } from "@/lib/prisma";
import StoresTable from "./StoresTable";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StoresPage() {
  const stores = await prisma.store.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
        <Link
          href="/admin/stores/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add Store
        </Link>
      </div>

      <StoresTable stores={stores.map((store) => ({
        ...store,
        createdAt: store.createdAt.toISOString(),
        updatedAt: store.updatedAt.toISOString(),
      }))} />
    </div>
  );
}
