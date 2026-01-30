import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DealsTable } from "./DealsTable";

export default async function DealsPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const deals = await prisma.deal.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-600 mt-1">Manage all deals and offers</p>
        </div>
        <Link
          href="/admin/deals/create"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
        >
          ➕ New Deal
        </Link>
      </div>

      {/* Deals Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Deals</h2>
        </div>

        {deals.length === 0 ? (
          <p className="px-6 py-4 text-gray-600">No deals found</p>
        ) : (
          <DealsTable initialDeals={deals} />
        )}
      </div>
    </div>
  );
}
