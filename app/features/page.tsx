import Link from "next/link";
import { prisma } from "@/lib/prisma";

const defaultFeatures = [
  {
    icon: "🔥",
    title: "Real-Time Deal Alerts",
    description: "Get instant notifications for the best deals, loot, and price drops across all major e-commerce platforms.",
    details: [
      "Telegram channel for instant alerts",
      "Browser notifications for price drops",
      "Daily deal digest emails",
    ],
    linkUrl: "/telegram",
    linkText: "Join Telegram",
  },
  {
    icon: "💰",
    title: "Verified Coupons",
    description: "Access thousands of verified coupon codes that actually work. We test every coupon before publishing.",
    details: [
      "100% working coupons",
      "Regularly updated codes",
      "Category-wise organization",
    ],
    linkUrl: "/coupon",
    linkText: "Browse Coupons",
  },
  {
    icon: "📊",
    title: "Price Tracking",
    description: "Track prices on your favorite products and get notified when prices drop to their lowest.",
    details: [
      "Historical price charts",
      "Price drop alerts",
      "Price comparison across sites",
    ],
    linkUrl: null,
    linkText: null,
  },
  {
    icon: "🔍",
    title: "Smart Search",
    description: "Find the best deals instantly with our powerful search and filtering system.",
    details: [
      "Filter by discount percentage",
      "Sort by price or popularity",
      "Search by product name or category",
    ],
    linkUrl: null,
    linkText: null,
  },
  {
    icon: "📱",
    title: "Mobile Friendly",
    description: "Browse deals on any device with our fully responsive design and mobile app.",
    details: [
      "Responsive web design",
      "Fast loading pages",
      "Easy navigation",
    ],
    linkUrl: null,
    linkText: null,
  },
  {
    icon: "🛡️",
    title: "Trust & Safety",
    description: "Shop with confidence knowing all deals and coupons are verified for authenticity.",
    details: [
      "Verified merchant partnerships",
      "Secure affiliate links",
      "No hidden terms",
    ],
    linkUrl: null,
    linkText: null,
  },
];

const defaultStats = [
  { value: "50K+", label: "Active Users" },
  { value: "10K+", label: "Deals Posted" },
  { value: "500+", label: "Working Coupons" },
  { value: "₹1Cr+", label: "Savings Delivered" },
];

const defaultHowItWorks = [
  {
    step: 1,
    icon: "🔍",
    title: "Search or Browse",
    description: "Find products you're interested in or browse through our curated categories.",
  },
  {
    step: 2,
    icon: "💵",
    title: "Compare Prices",
    description: "See price history and compare across different e-commerce platforms.",
  },
  {
    step: 3,
    icon: "🎫",
    title: "Apply Coupon",
    description: "Copy the working coupon code and apply it at checkout.",
  },
  {
    step: 4,
    icon: "💰",
    title: "Save Money",
    description: "Complete your purchase and enjoy the savings!",
  },
];

async function getFeatures() {
  try {
    const features = await prisma.feature.findMany({
      where: { isActive: true },
      include: {
        featureGroup: true,
      },
      orderBy: { order: "asc" },
    });

    return features.map((feature) => ({
      icon: feature.icon || "✨",
      title: feature.title,
      description: feature.description,
      details: feature.linkUrl ? [`Learn more about ${feature.title}`] : [],
      linkUrl: feature.linkUrl,
      linkText: feature.linkText,
    }));
  } catch (error) {
    console.error("Failed to fetch features:", error);
    return defaultFeatures;
  }
}

export default async function FeaturesPage() {
  const features = await getFeatures();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
            ✨ Why Choose Us
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Our Features</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Everything you need to become a smart shopper and save big on every purchase
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {defaultStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Powerful Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Built with smart shoppers in mind, our platform offers everything you need to find the best deals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 group"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              {feature.details.length > 0 && (
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="text-green-500">✓</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
              {feature.linkUrl && (
                <Link
                  href={feature.linkUrl}
                  className="inline-flex items-center gap-1 text-green-600 font-medium mt-4 hover:underline"
                >
                  {feature.linkText || "Learn More"} →
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start saving in just 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {defaultHowItWorks.map((step) => (
              <div key={step.step} className="text-center relative">
                {step.step < 4 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200">
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500" />
                  </div>
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-2xl text-white mx-auto mb-4">
                    {step.icon}
                  </div>
                  <div className="text-green-600 font-bold text-sm mb-2">Step {step.step}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Support */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Supported Platforms
              </h2>
              <p className="text-gray-400 mb-6">
                We track deals across all major Indian e-commerce platforms
              </p>
              <div className="flex flex-wrap gap-4">
                {["Amazon", "Flipkart", "Myntra", "Ajio", "Snapdeal", "Paytm", "ShopClues"].map((platform) => (
                  <span
                    key={platform}
                    className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/deals"
              className="bg-green-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-600 transition whitespace-nowrap"
            >
              Explore Deals →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to Start Saving?</h2>
          <p className="text-white/80 mb-6">Join thousands of smart shoppers who trust BachatList</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/deals"
              className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              Browse Deals
            </Link>
            <Link
              href="/telegram"
              className="bg-white/20 text-white border border-white/30 px-8 py-3 rounded-xl font-semibold hover:bg-white/30 transition"
            >
              Join Telegram
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
