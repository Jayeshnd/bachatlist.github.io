import { NextResponse } from "next/server";

const CUELINKS_API_BASE = "https://www.cuelinks.com/api/v2";
const API_KEY = process.env.CUELINKS_API_KEY || "ZmIYjVViu4gjZnVq9vM0lrjRMdEq3qaGswlhVscNmLw";

interface CuelinksCampaign {
  id: number;
  name: string;
  description: string;
  image_url: string;
  categories: string[];
  url: string;
  coupon_code?: string;
  cashback?: string;
  commission_rate?: string;
  country_id?: number;
  store_name?: string;
  category_name?: string;
}

interface CuelinksResponse {
  offers?: CuelinksCampaign[];
  campaigns?: CuelinksCampaign[];
  meta?: {
    current_page: number;
    total_pages: number;
    total_offers?: number;
    total_campaigns?: number;
    per_page: number;
  };
  message?: string;
}

// Cuelinks category mapping
const CATEGORIES = [
  { id: "", name: "All Offers" },
  { id: "shopping", name: "Shopping" },
  { id: "travel", name: "Travel" },
  { id: "food", name: "Food" },
  { id: "recharge", name: "Recharge" },
  { id: "fashion", name: "Fashion" },
  { id: "electronics", name: "Electronics" },
  { id: "beauty", name: "Beauty" },
  { id: "fitness", name: "Fitness" },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const perPage = searchParams.get("per_page") || "50";
    const searchTerm = searchParams.get("search_term") || "";
    const category = searchParams.get("category") || "";
    const countryId = searchParams.get("country_id") || "252";

    // Build URL with parameters
    const params = new URLSearchParams({
      sort_column: "id",
      sort_direction: "asc",
      page: page,
      per_page: perPage,
      country_id: countryId,
    });

    if (searchTerm) {
      params.append("search_term", searchTerm);
    }
    if (category) {
      params.append("category", category);
    }

    // Use offers.json to get coupon codes
    const url = `${CUELINKS_API_BASE}/offers.json?${params.toString()}`;

    console.log("[Cuelinks] Request URL:", url);
    console.log("[Cuelinks] API Key configured:", API_KEY ? "Yes" : "No");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Token token=${API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Cuelinks API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error("[Cuelinks] Error response:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch Cuelinks campaigns", details: errorText },
        { status: response.status }
      );
    }

    console.log("[Cuelinks] Response status:", response.status);

    const data: CuelinksResponse = await response.json();

    console.log("[Cuelinks] Meta:", data.meta);
    
    // Support both offers.json and campaigns.json response formats
    const items = data.offers || data.campaigns || [];
    
    if (!items || items.length === 0) {
      console.error("Cuelinks API returned no data:", data);
      return NextResponse.json(
        { error: data.message || "No offers found", data },
        { status: 500 }
      );
    }

    console.log("[Cuelinks] Items count:", items.length);

    // Transform to our format
    const transformedCampaigns = items.map((campaign: CuelinksCampaign) => ({
      id: campaign.id.toString(),
      name: campaign.name,
      description: campaign.description,
      imageUrl: campaign.image_url,
      categories: campaign.categories || [campaign.category_name].filter(Boolean),
      url: campaign.url,
      couponCode: campaign.coupon_code || null,
      cashback: campaign.cashback || campaign.commission_rate || null,
      storeName: campaign.store_name || null,
      categoryName: campaign.category_name || null,
    }));

    return NextResponse.json({
      campaigns: transformedCampaigns,
      categories: CATEGORIES,
      meta: {
        ...data.meta,
        total_offers: data.meta?.total_offers || data.meta?.total_campaigns || 0,
      },
    });
  } catch (error) {
    console.error("Failed to fetch Cuelinks campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch Cuelinks campaigns", message: String(error) },
      { status: 500 }
    );
  }
}
