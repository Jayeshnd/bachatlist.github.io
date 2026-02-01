import { NextResponse } from "next/server";

const CUELINKS_API_BASE = "https://www.cuelinks.com/api/v2";
const API_KEY = process.env.CUELINKS_API_KEY || "ZmIYjVViu4gjZnVq9vM0lrjRMdEq3qaGswlhVscNmLw";

interface CuelinksClickRequest {
  campaign_id: number;
  sub_id_1?: string; // Your internal tracking ID (deal ID)
  sub_id_2?: string; // Additional tracking
  sub_id_3?: string;
  redirect_url: string;
}

interface CuelinksClickResponse {
  click_id: string;
  url: string;
  status: "success" | "error";
  message?: string;
}

// POST /api/cuelinks/click - Track a click and get redirected URL
export async function POST(request: Request) {
  try {
    const body: CuelinksClickRequest = await request.json();

    console.log("[Cuelinks Click] Received click request:", body);

    // Validate required fields
    if (!body.campaign_id || !body.redirect_url) {
      return NextResponse.json(
        { error: "Missing required fields: campaign_id and redirect_url" },
        { status: 400 }
      );
    }

    // Build the click tracking URL
    const params = new URLSearchParams({
      campaign_id: body.campaign_id.toString(),
      redirect_url: body.redirect_url,
    });

    // Add optional sub_ids for tracking
    if (body.sub_id_1) params.append("sub_id_1", body.sub_id_1);
    if (body.sub_id_2) params.append("sub_id_2", body.sub_id_2);
    if (body.sub_id_3) params.append("sub_id_3", body.sub_id_3);

    const url = `${CUELINKS_API_BASE}/cpc_clicks.json?${params.toString()}`;

    console.log("[Cuelinks Click] Tracking URL:", url);

    // Call Cuelinks CPC click API
    const response = await fetch(url, {
      method: "GET", // Cuelinks uses GET for click tracking
      headers: {
        "Authorization": `Token token=${API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Cuelinks Click API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error("[Cuelinks Click] Error response:", errorText);
      
      // Even on error, return the redirect URL so user can still go to merchant
      return NextResponse.json({
        click_id: null,
        url: body.redirect_url,
        status: "error",
        message: `Cuelinks API error: ${response.status}`,
        fallback_url: body.redirect_url,
      });
    }

    const data: CuelinksClickResponse = await response.json();

    console.log("[Cuelinks Click] Success:", data);

    return NextResponse.json({
      click_id: data.click_id,
      url: data.url || body.redirect_url,
      status: data.status || "success",
      message: data.message,
    });
  } catch (error) {
    console.error("Failed to track Cuelinks click:", error);
    return NextResponse.json(
      { 
        error: "Failed to track click",
        message: String(error),
        // Return redirect URL as fallback
        url: null,
      },
      { status: 500 }
    );
  }
}

// GET /api/cuelinks/click - Alternative: direct click tracking
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const campaignId = searchParams.get("campaign_id");
    const redirectUrl = searchParams.get("redirect_url");
    const dealId = searchParams.get("sub_id_1");
    const source = searchParams.get("source") || "website";

    if (!campaignId || !redirectUrl) {
      return NextResponse.json(
        { error: "Missing required parameters: campaign_id and redirect_url" },
        { status: 400 }
      );
    }

    console.log("[Cuelinks Click] GET request:", { campaignId, redirectUrl, dealId, source });

    // Build tracking URL
    const params = new URLSearchParams({
      campaign_id: campaignId,
      redirect_url: redirectUrl,
    });

    if (dealId) params.append("sub_id_1", dealId);
    params.append("sub_id_2", source);

    const url = `${CUELINKS_API_BASE}/cpc_clicks.json?${params.toString()}`;

    // Call Cuelinks API
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Token token=${API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    let trackingUrl = redirectUrl;
    
    if (response.ok) {
      const data = await response.json();
      if (data.url) {
        trackingUrl = data.url;
      }
    }

    // Redirect to the tracking URL
    return NextResponse.redirect(trackingUrl, 302);
  } catch (error) {
    console.error("Failed to process click redirect:", error);
    
    // Fallback redirect
    const redirectUrl = new URL(request.url).searchParams.get("redirect_url");
    if (redirectUrl) {
      return NextResponse.redirect(redirectUrl, 302);
    }
    
    return NextResponse.json(
      { error: "Failed to process click" },
      { status: 500 }
    );
  }
}
