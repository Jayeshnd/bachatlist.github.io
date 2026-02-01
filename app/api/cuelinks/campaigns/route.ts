import { NextResponse } from "next/server";

const CUELINKS_API_BASE = "https://api.cuelinks.com";
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
}

interface CuelinksResponse {
  success: boolean;
  data?: {
    campaigns?: CuelinksCampaign[];
    campaigns_list?: CuelinksCampaign[];
  };
  message?: string;
}

export async function GET(request: Request) {
  try {
    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const perPage = searchParams.get("per_page") || "20";

    const url = `${CUELINKS_API_BASE}/api/v2/campaigns/getCampaigns?page=${page}&per_page=${perPage}`;

    // Diagnostic logging
    console.log("[Cuelinks] Request URL:", url);
    console.log("[Cuelinks] API Key configured:", API_KEY ? "Yes" : "No");
    console.log("[Cuelinks] API Key length:", API_KEY?.length);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Cuelinks API error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: "Failed to fetch Cuelinks campaigns" },
        { status: response.status }
      );
    }

    // Diagnostic logging for response
    console.log("[Cuelinks] Response status:", response.status);
    console.log("[Cuelinks] Response headers:", Object.fromEntries(response.headers.entries()));

    const data: CuelinksResponse = await response.json();

    // Log raw response for debugging
    console.log("[Cuelinks] Raw response:", JSON.stringify(data, null, 2).substring(0, 500));

    if (!data.success || !data.data) {
      console.error("Cuelinks API returned unsuccessful response:", data);
      return NextResponse.json(
        { error: data.message || "Failed to fetch campaigns" },
        { status: 500 }
      );
    }

    // Extract campaigns from different response formats
    const campaigns = data.data.campaigns || data.data.campaigns_list || [];

    // Transform to our format
    const transformedCampaigns = campaigns.map((campaign: CuelinksCampaign) => ({
      id: campaign.id.toString(),
      name: campaign.name,
      description: campaign.description,
      imageUrl: campaign.image_url,
      categories: campaign.categories,
      url: campaign.url,
      couponCode: campaign.coupon_code || null,
      cashback: campaign.cashback || null,
    }));

    return NextResponse.json(transformedCampaigns);
  } catch (error) {
    console.error("Failed to fetch Cuelinks campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch Cuelinks campaigns" },
      { status: 500 }
    );
  }
}
