import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST - Bulk import campaigns from Cuelinks
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { campaignIds, status = "DRAFT" } = body;

    if (!campaignIds || !Array.isArray(campaignIds) || campaignIds.length === 0) {
      return NextResponse.json(
        { error: "No campaign IDs provided" },
        { status: 400 }
      );
    }

    // Get Cuelinks API key
    const CUELINKS_API_KEY = process.env.CUELINKS_API_KEY;
    if (!CUELINKS_API_KEY) {
      return NextResponse.json(
        { error: "Cuelinks API key not configured" },
        { status: 500 }
      );
    }

    // Fetch campaigns from Cuelinks
    const CUELINKS_API_BASE = "https://www.cuelinks.com/api/v2";
    const response = await fetch(`${CUELINKS_API_BASE}/campaigns.json?per_page=100&country_id=252`, {
      headers: {
        "Authorization": `Token token=${CUELINKS_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch campaigns from Cuelinks" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const allCampaigns = data.campaigns || [];

    // Filter campaigns by IDs
    const campaignsToImport = allCampaigns.filter((c: any) => 
      campaignIds.includes(c.id.toString())
    );

    // Get or create system user
    let systemUser = await prisma.user.findFirst({
      where: { role: "ADMIN" }
    });

    if (!systemUser) {
      systemUser = await prisma.user.findFirst();
    }

    if (!systemUser) {
      return NextResponse.json(
        { error: "No system user found" },
        { status: 500 }
      );
    }

    // Get or create Cuelinks category
    let cuelinksCategory = await prisma.category.findFirst({
      where: { slug: "cuelinks" }
    });

    if (!cuelinksCategory) {
      cuelinksCategory = await prisma.category.create({
        data: {
          name: "Cuelinks",
          slug: "cuelinks",
          icon: "🔗",
        },
      });
    }

    // Import each campaign
    const results = {
      imported: 0,
      skipped: 0,
      failed: 0,
    };

    for (const campaign of campaignsToImport) {
      try {
        // Use fallback title
        const campaignTitle = campaign.title || campaign.campaign || `deal-${campaign.id}`;
        const campaignDesc = campaign.description || '';
        
        // Check if deal already exists
        const existingDeal = await prisma.deal.findFirst({
          where: {
            OR: [
              { title: campaignTitle },
              { affiliateUrl: campaign.affiliate_url || campaign.url },
            ],
          },
        });

        if (existingDeal) {
          results.skipped++;
          continue;
        }

        // Create new deal
        await prisma.deal.create({
          data: {
            title: campaignTitle,
            slug: campaignTitle
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, ""),
            description: campaignDesc,
            shortDesc: campaignDesc.substring(0, 200) || "",
            currentPrice: 0,
            originalPrice: 0,
            productUrl: campaign.url,
            affiliateUrl: campaign.affiliate_url,
            coupon: campaign.coupon_code || null,
            status: status,
            categoryId: cuelinksCategory.id,
            isLoot: false,
            images: JSON.stringify(campaign.image_url ? [campaign.image_url] : []),
            authorId: systemUser.id,
          },
        });

        results.imported++;
      } catch (error) {
        console.error(`Failed to import campaign ${campaign.id}:`, error);
        results.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Imported ${results.imported} deals, skipped ${results.skipped}, failed ${results.failed}`,
      results,
    });
  } catch (error) {
    console.error("Bulk import error:", error);
    return NextResponse.json(
      { error: "Failed to bulk import campaigns" },
      { status: 500 }
    );
  }
}
