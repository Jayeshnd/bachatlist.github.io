import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { HotDealsTable } from "./HotDealsTable";
import { AddDealForm } from "./AddDealForm";

export default async function HotDealsPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const [hotDeals, allDeals] = await Promise.all([
    prisma.hotDeal.findMany({
      include: {
        deal: {
          include: { category: true },
        },
      },
      orderBy: { order: "asc" },
    }),
    prisma.deal.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true },
    }),
  ]);

  // Get deals that are already in hot deals
  const hotDealIds = hotDeals.map((hd) => hd.dealId);
  const availableDeals = allDeals.filter((deal) => !hotDealIds.includes(deal.id));

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hot Deals</h1>
          <p className="text-gray-600 mt-1">Manage curated hot deals for homepage and loot page</p>
        </div>
      </div>

      {/* Add Deal Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add to Hot Deals</h2>
        <AddDealForm availableDeals={availableDeals} />
      </div>

      {/* Hot Deals Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Hot Deals List</h2>
        </div>

        {hotDeals.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🔥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hot deals yet</h3>
            <p className="text-gray-600">Add deals to the hot deals list above</p>
          </div>
        ) : (
          <HotDealsTable initialHotDeals={hotDeals} />
        )}
      </div>
    </div>
  );
}
