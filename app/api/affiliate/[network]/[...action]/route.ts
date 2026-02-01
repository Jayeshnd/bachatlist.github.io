import { NextResponse } from "next/server";

// ============================================
// CONFIGURATION - Add new APIs here only!
// ============================================

interface ApiConfig {
  name: string;
  baseUrl: string;
  apiKey: string; // env var name
  authType: "token" | "bearer"; // token=Token token=xxx, bearer=Bearer xxx
  endpoints: {
    [key: string]: {
      method: "GET" | "POST";
      path: string;
      params?: string[]; // query params to pass through
      bodyParams?: string[]; // body params to pass through
      responseMap?: {
        [key: string]: string; // map API response key to our key
      };
    };
  };
}

// ✨ Add new affiliate networks here!
const API_CONFIGS: Record<string, ApiConfig> = {
  cuelinks: {
    name: "Cuelinks",
    baseUrl: "https://www.cuelinks.com/api/v2",
    apiKey: "CUELINKS_API_KEY",
    authType: "token",
    endpoints: {
      campaigns: {
        method: "GET",
        path: "/campaigns.json",
        params: ["page", "per_page", "search_term", "category", "country_id", "sort_column", "sort_direction"],
      },
      clicks: {
        method: "GET",
        path: "/cpc_clicks.json",
        params: ["campaign_id", "redirect_url", "sub_id_1", "sub_id_2", "sub_id_3"],
      },
      categories: {
        method: "GET",
        path: "/categories.json",
      },
    },
  },
  vcommission: {
    name: "VCommission",
    baseUrl: "https://api.vcommission.com",
    apiKey: "VCOMMISSION_API_KEY",
    authType: "bearer",
    endpoints: {
      campaigns: {
        method: "GET",
        path: "/offers/campaigns",
        params: ["page", "limit", "category"],
      },
      reports: {
        method: "GET",
        path: "/reports",
        params: ["from_date", "to_date", "offer_id"],
      },
      clicks: {
        method: "GET",
        path: "/reports/clicks",
        params: ["from_date", "to_date", "offer_id"],
      },
    },
  },
  trackier: {
    name: "Trackier",
    baseUrl: "https://api.perfios.com/v1/publisher",
    apiKey: "TRACKIER_API_KEY",
    authType: "bearer",
    endpoints: {
      campaigns: {
        method: "GET",
        path: "/campaigns",
        params: ["page", "limit", "status", "category"],
      },
      reports: {
        method: "GET",
        path: "/reports",
        params: ["from_date", "to_date", "campaign_id"],
      },
      clicks: {
        method: "GET",
        path: "/clicks",
        params: ["from_date", "to_date", "campaign_id", "page"],
      },
      conversions: {
        method: "GET",
        path: "/conversions",
        params: ["from_date", "to_date", "campaign_id"],
      },
    },
  },
  // ✨ Add more networks like this:
  // impact: {
  //   name: "Impact Radius",
  //   baseUrl: "https://api.impact.com",
  //   apiKey: "IMPACT_API_KEY",
  //   authType: "bearer",
  //   endpoints: {
  //     campaigns: { method: "GET", path: "/Campaigns" },
  //     reports: { method: "GET", path: "/Reports" },
  //   },
  // },
};

// ============================================
// GENERIC API HANDLER
// ============================================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ network: string; action: string[] }> }
) {
  try {
    const { network, action } = await params;
    const networkKey = network.toLowerCase();
    const actionKey = action?.[0] || "";

    // Check if network is configured
    const config = API_CONFIGS[networkKey];
    if (!config) {
      return NextResponse.json(
        { error: `Network '${network}' not configured. Add it to API_CONFIGS.` },
        { status: 404 }
      );
    }

    // Check if action is configured
    const endpoint = config.endpoints[actionKey];
    if (!endpoint) {
      return NextResponse.json(
        { error: `Action '${actionKey}' not found for network '${network}'. Available: ${Object.keys(config.endpoints).join(", ")}` },
        { status: 404 }
      );
    }

    const apiKey = process.env[config.apiKey] || "";
    if (!apiKey) {
      return NextResponse.json(
        { error: `API key not configured. Set ${config.apiKey} in environment.` },
        { status: 500 }
      );
    }

    // Build URL with query params
    const url = new URL(`${config.baseUrl}${endpoint.path}`);
    const { searchParams } = new URL(request.url);

    // Pass through configured params
    if (endpoint.params) {
      for (const param of endpoint.params) {
        const value = searchParams.get(param);
        if (value) {
          url.searchParams.set(param, value);
        }
      }
    }

    console.log(`[Affiliate API] ${config.name} ${actionKey}:`, url.toString());

    // Build headers based on auth type
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
    
    if (config.authType === "token") {
      headers["Authorization"] = `Token token=${apiKey}`;
    } else {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    // Make API call
    const response = await fetch(url.toString(), {
      method: endpoint.method,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Affiliate API] Error:`, errorText);
      return NextResponse.json(
        { error: `API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Apply response mapping if configured
    if (endpoint.responseMap) {
      const mappedData: Record<string, any> = {};
      for (const [apiKey, ourKey] of Object.entries(endpoint.responseMap)) {
        if (data[apiKey] !== undefined) {
          mappedData[ourKey] = data[apiKey];
        }
      }
      return NextResponse.json(mappedData);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[Affiliate API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data", message: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ network: string; action: string[] }> }
) {
  try {
    const { network, action } = await params;
    const networkKey = network.toLowerCase();
    const actionKey = action?.[0] || "";

    // Check if network is configured
    const config = API_CONFIGS[networkKey];
    if (!config) {
      return NextResponse.json(
        { error: `Network '${network}' not configured.` },
        { status: 404 }
      );
    }

    const endpoint = config.endpoints[actionKey];
    if (!endpoint) {
      return NextResponse.json(
        { error: `Action '${actionKey}' not found.` },
        { status: 404 }
      );
    }

    const apiKey = process.env[config.apiKey] || "";
    const body = await request.json();

    // Build URL
    const url = new URL(`${config.baseUrl}${endpoint.path}`);

    // Handle params from query string or body
    const { searchParams } = new URL(request.url);

    // For GET requests, params in body are ignored
    if (endpoint.method === "GET") {
      if (endpoint.params) {
        for (const param of endpoint.params) {
          const value = searchParams.get(param) || body?.[param];
          if (value) url.searchParams.set(param, value);
        }
      }
    }

    console.log(`[Affiliate API] POST ${config.name} ${actionKey}:`, url.toString());

    // Build headers based on auth type
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
    
    if (config.authType === "token") {
      headers["Authorization"] = `Token token=${apiKey}`;
    } else {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const fetchOptions: RequestInit = {
      method: "POST",
      headers,
    };

    // For GET, no body. For POST, include body params
    if (endpoint.method === "POST") {
      const bodyData: Record<string, any> = {};
      if (endpoint.params) {
        for (const param of endpoint.params) {
          const value = searchParams.get(param) || body?.[param];
          if (value) bodyData[param] = value;
        }
      }
      if (endpoint.bodyParams) {
        for (const param of endpoint.bodyParams) {
          if (body?.[param] !== undefined) {
            bodyData[param] = body[param];
          }
        }
      }
      fetchOptions.body = JSON.stringify(bodyData);
    }

    const response = await fetch(url.toString(), fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Affiliate API] POST Error:", error);
    return NextResponse.json(
      { error: "Failed to process request", message: String(error) },
      { status: 500 }
    );
  }
}
