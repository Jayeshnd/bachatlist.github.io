import { NextResponse } from "next/server";

const CUELINKS_API_BASE = "https://www.cuelinks.com/api/v2";
const API_KEY = process.env.CUELINKS_API_KEY || "ZmIYjVViu4gjZnVq9vM0lrjRMdEq3qaGswlhVscNmLw";

// Cuelinks API response format
interface CuelinksCampaign {
  id: number;
  camapign_id?: number;
  campaign: string; // Merchant name
  title: string; // Offer title
  description: string;
  terms_and_condition?: string;
  coupon_code?: string;
  image_url?: string;
  type?: string;
  shipping_charge?: string;
  status?: string;
  url: string; // Merchant URL
  affiliate_url: string; // Tracked URL
  start_date?: string;
  end_date?: string;
  categories: Record<string, string>; // Object like {"6": "Flowers & Gifts", "14": "Services"}
}

interface CuelinksResponse {
  total_count?: number;
  offers?: CuelinksCampaign[];
  campaigns?: CuelinksCampaign[];
}

// Cuelinks category mapping
const CATEGORIES = [
  { id: "", name: "All Offers" },
  { id: "shopping", name: "🛒 Shopping" },
  { id: "travel", name: "✈️ Travel" },
  { id: "food", name: "🍔 Food" },
  { id: "recharge", name: "📱 Recharge" },
  { id: "fashion", name: "👗 Fashion" },
  { id: "electronics", name: "💻 Electronics" },
  { id: "beauty", name: "💄 Beauty" },
  { id: "fitness", name: "💪 Fitness" },
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

    console.log("[Cuelinks] Total count:", data.total_count);
    
    // Support both offers.json and campaigns.json response formats
    const items = data.offers || data.campaigns || [];
    
    if (!items || items.length === 0) {
      console.error("Cuelinks API returned no data:", data);
      return NextResponse.json(
        { error: "No offers found", data },
        { status: 500 }
      );
    }

    console.log("[Cuelinks] Items count:", items.length);

    // Transform to our format - use correct field names from Cuelinks API
    const transformedCampaigns = items.map((campaign: CuelinksCampaign) => {
      // Convert categories object to array
      const categoriesArray = campaign.categories 
        ? Object.values(campaign.categories)
        : [];

      return {
        id: campaign.id.toString(),
        title: campaign.title,
        name: campaign.title, // For compatibility
        description: campaign.description,
        image_url: campaign.image_url || "", // snake_case for frontend compatibility
        categories: categoriesArray,
        url: campaign.affiliate_url || campaign.url, // Use tracked URL
        affiliate_url: campaign.affiliate_url,
        coupon_code: campaign.coupon_code || null,
        campaign: campaign.campaign,
        merchantName: campaign.campaign,
        endDate: campaign.end_date,
      };
    });

    return NextResponse.json({
      campaigns: transformedCampaigns,
      categories: CATEGORIES,
      meta: {
        total_count: data.total_count || transformedCampaigns.length,
      },
    });
  } catch (error) {
    console.error("Failed to fetch Cuelinks campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch Cuelinks campaigns" },
      { status: 500 }
    );
  }
}
