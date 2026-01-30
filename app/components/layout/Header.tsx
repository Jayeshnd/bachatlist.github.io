// components/layout/Header.tsx
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">
          <Link href="/">BachatList</Link>
        </div>
        <nav className="hidden md:flex space-x-6 items-center">
          <Link href="/deals" className="text-gray-600 hover:text-blue-600">Deals</Link>
          <Link href="/categories" className="text-gray-600 hover:text-blue-600">Categories</Link>
          <Link href="/about" className="text-gray-600 hover:text-blue-600">About Us</Link>
          <Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
          <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Sign Up</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
