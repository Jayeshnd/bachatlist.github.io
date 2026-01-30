// components/layout/Footer.tsx
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">BachatList</h3>
            <p className="text-gray-400">Your one-stop destination for coupons and discounts.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/deals" className="text-gray-400 hover:text-white">Deals</a></li>
              <li><a href="/categories" className="text-gray-400 hover:text-white">Categories</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter to get the latest deals.</p>
            <div className="flex">
              <input type="email" placeholder="Your email" className="w-full px-4 py-2 rounded-l-md text-gray-800 focus:outline-none" />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 pt-8 mt-8 border-t border-gray-700">
          <p>&copy; {new Date().getFullYear()} BachatList. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
