import Link from "next/link";

const channelStats = [
  { value: "50K+", label: "Subscribers", icon: "👥" },
  { value: "1000+", label: "Deals Shared", icon: "🔥" },
  { value: "24/7", label: "Active Alerts", icon: "⚡" },
  { value: "₹1Cr+", label: "Savings", icon: "💰" },
];

const benefits = [
  {
    icon: "🔔",
    title: "Instant Notifications",
    description: "Get real-time alerts for hot deals, loot, and price drops as soon as they go live.",
  },
  {
    icon: "🔥",
    title: "Exclusive Loot Deals",
    description: "Access to exclusive loot deals that are shared first on our Telegram channel.",
  },
  {
    icon: "💸",
    title: "Premium Coupons",
    description: "Special coupons and cashback offers only available to Telegram subscribers.",
  },
  {
    icon: "👥",
    title: "Community Support",
    description: "Join a community of smart shoppers and share deals with each other.",
  },
];

const recentPosts = [
  {
    type: "LOOT",
    title: "boAt Rockerz 550 @ ₹1299 (67% OFF)",
    time: "2 hours ago",
    urgent: true,
  },
  {
    type: "DEAL",
    title: "OnePlus Nord CE 3 Lite @ ₹14,999",
    time: "5 hours ago",
    urgent: false,
  },
  {
    type: "COUPON",
    title: "Amazon: Extra 10% off on Electronics",
    time: "Yesterday",
    urgent: false,
  },
  {
    type: "PRICE DROP",
    title: "Samsung Galaxy M14 @ ₹12,499",
    time: "Yesterday",
    urgent: false,
  },
];

export default function TelegramPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#229ED9] to-[#0088cc] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">📱</div>
          <span className="inline-block bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
            🔥 Join Our Community
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Join BachatList Telegram Channel
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-6">
            Get instant alerts for the best deals, loot, and coupons directly on your phone
          </p>
          <a
            href="https://t.me/bachatlist"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#229ED9] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.696.064-1.225-.46-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Join Channel Now
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {channelStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Join Our Telegram?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get exclusive access to deals and savings opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 text-center"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Posts Preview */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What You'll Get</h2>
            <p className="text-gray-600">Sample of recent deals shared on our channel</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#229ED9] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">B</span>
                </div>
                <span className="font-bold text-gray-900">BachatList</span>
              </div>
              <span className="text-gray-500 text-sm">Telegram Channel</span>
            </div>

            <div className="space-y-3">
              {recentPosts.map((post, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    post.urgent
                      ? "bg-red-50 border border-red-200"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        post.type === "LOOT"
                          ? "bg-red-500 text-white"
                          : post.type === "COUPON"
                          ? "bg-green-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {post.type}
                    </span>
                    <span className="text-xs text-gray-500">{post.time}</span>
                  </div>
                  <p className="font-medium text-gray-900">{post.title}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <p className="text-gray-500 text-sm mb-3">And many more deals every day!</p>
              <a
                href="https://t.me/bachatlist"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#229ED9] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#0088cc] transition"
              >
                Join Channel →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Don't Miss Out!</h2>
          <p className="text-white/80 mb-6">Join 50,000+ smart shoppers who save daily</p>
          <a
            href="https://t.me/bachatlist"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.696.064-1.225-.46-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Join Now
          </a>
        </div>
      </section>
    </div>
  );
}
