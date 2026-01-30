import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Default fallback data
const defaultTeam = [
  {
    name: "Rahul Sharma",
    role: "Founder & CEO",
    bio: "Passionate about helping Indians save money online. 10+ years in e-commerce.",
    icon: "👨‍💼",
  },
  {
    name: "Priya Singh",
    role: "Head of Content",
    bio: "Expert in creating helpful shopping guides and deal alerts.",
    icon: "👩‍💼",
  },
  {
    name: "Amit Kumar",
    role: "Tech Lead",
    bio: "Building tools to help users find the best deals automatically.",
    icon: "👨‍💻",
  },
];

const defaultMilestones = [
  { year: "2020", title: "Founded", description: "Started with a mission to help Indians save money" },
  { year: "2021", title: "10K Users", description: "Reached our first 10,000 active users" },
  { year: "2022", title: "100K+ Deals", description: "Published over 100,000 verified deals" },
  { year: "2023", title: "50K Community", description: "Built a community of 50,000+ smart shoppers" },
  { year: "2024", title: "₹1Cr Saved", description: "Helped users save over 1 crore rupees" },
];

async function getAboutContent() {
  try {
    // Fetch sections
    const sections = await prisma.aboutSection.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    // Fetch team members
    const teamMembers = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    // Fetch testimonials
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return {
      sections,
      teamMembers: teamMembers.map((member) => ({
        name: member.name,
        role: member.role,
        bio: member.bio || "",
        icon: member.image || "👤",
      })),
      testimonials: testimonials.map((t) => ({
        quote: t.quote,
        authorName: t.authorName,
        authorRole: t.authorRole,
        company: t.company,
        rating: t.rating,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch about content:", error);
    return { sections: [], teamMembers: [], testimonials: [] };
  }
}

export default async function AboutPage() {
  const aboutData = await getAboutContent();
  const team = aboutData.teamMembers.length > 0 ? aboutData.teamMembers : defaultTeam;

  // Find specific sections
  const missionSection = aboutData.sections.find((s) => s.sectionKey === "mission");
  const storySection = aboutData.sections.find((s) => s.sectionKey === "our_story");
  const valuesSection = aboutData.sections.find((s) => s.sectionKey === "values");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
            📖 Our Story
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">About BachatList</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            We're on a mission to help every Indian shopper save money on every purchase
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {missionSection?.title || "Our Mission"}
            </h2>
            <div 
              className="text-gray-600 mb-4"
              dangerouslySetInnerHTML={{ 
                __html: missionSection?.content || `
                  <p>BachatList was founded with a simple goal: to make saving money accessible to everyone.</p>
                  <p>We believe that everyone deserves to get the best value for their hard-earned money.</p>
                  <p>Our team works tirelessly to find the best deals, verify coupons, and bring you real-time alerts so you never miss an opportunity to save.</p>
                  <p>Join thousands of smart shoppers who trust BachatList for their shopping needs.</p>
                `
              }}
            />
          </div>
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">Save More, Shop Smarter</h3>
              <p className="text-green-700">
                Your trusted partner for finding the best deals and coupons online
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Trust & Transparency</h3>
              <p className="text-gray-600">
                We verify every deal and coupon before publishing. No fake discounts, no hidden terms.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">User-First Approach</h3>
              <p className="text-gray-600">
                Every feature we build is designed with our users in mind. Your savings are our priority.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Community Driven</h3>
              <p className="text-gray-600">
                We listen to our community and continuously improve based on your feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Journey</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From a small start to helping millions save
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-green-200 hidden md:block" />
          <div className="space-y-8">
            {defaultMilestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="flex-1 text-center md:text-right">
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <span className="text-green-600 font-bold text-2xl">{milestone.year}</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-2">{milestone.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{milestone.description}</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold z-10">
                  {index + 1}
                </div>
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The people behind BachatList
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-6xl mb-4">{member.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-green-600 font-medium text-sm mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to Start Saving?</h2>
          <p className="text-white/80 mb-6">Join our community of smart shoppers today</p>
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
