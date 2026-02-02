export const metadata = {
  title: "Terms of Service - BachatList",
  description: "Our terms of service outline the rules and guidelines for using our website.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Terms of Service</h1>
          <p className="text-white/80 text-lg">
            Rules and guidelines for using our website
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 prose prose-green max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be bound by the 
            terms and provision of this agreement.
          </p>

          <h2>2. Use of Service</h2>
          <p>
            This website is designed to help you find deals, coupons, and discounts from 
            various e-commerce platforms. You agree to use this service only for lawful 
            purposes and in a way that does not infringe the rights of others.
          </p>

          <h2>3. Content and Information</h2>
          <p>
            The deals, coupons, and offers featured on this website are provided by 
            third-party merchants. We do not guarantee the accuracy, completeness, or 
            reliability of any deal or coupon. Prices and availability are subject to 
            change without notice.
          </p>

          <h2>4. Affiliate Disclosure</h2>
          <p>
            This website may contain affiliate links. If you click on these links and 
            make a purchase, we may earn a commission at no additional cost to you. 
            This helps support our website and allows us to continue providing valuable 
            deals and information.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, and images, 
            is the property of BachatList or its content suppliers and is protected by 
            copyright laws.
          </p>

          <h2>6. User Accounts</h2>
          <p>
            Some features of this website may require you to create an account. You are 
            responsible for maintaining the confidentiality of your account credentials 
            and for all activities that occur under your account.
          </p>

          <h2>7. Prohibited Activities</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the website for any illegal or unauthorized purpose</li>
            <li>Interfere with or disrupt the website or servers</li>
            <li>Attempt to gain unauthorized access to any part of the website</li>
            <li>Reproduce, duplicate, copy, or resell any content from the website</li>
            <li>Use automated systems to access the website without permission</li>
          </ul>

          <h2>8. Disclaimer of Warranties</h2>
          <p>
            This website is provided "as is" without any representations or warranties, 
            express or implied. We make no representations or warranties in relation to 
            this website or the information and materials provided on this website.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            BachatList shall not be liable for any indirect, incidental, or consequential 
            damages arising out of your use of this website or your inability to use the website.
          </p>

          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Your continued use of 
            the website after any changes constitutes acceptance of the new terms.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with 
            the laws of India and you irrevocably submit to the exclusive jurisdiction 
            of the courts in that location.
          </p>

          <h2>12. Contact Information</h2>
          <p>
            If you have any questions about these terms of service, please contact us at 
            <a href="mailto:support@bachatlist.com"> support@bachatlist.com</a>
          </p>

          <p className="text-sm text-gray-500 mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>
    </div>
  );
}
