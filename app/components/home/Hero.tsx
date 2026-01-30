// components/home/Hero.tsx
const Hero = () => {
  return (
    <section className="bg-blue-50 text-center py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">Find the Best Deals Around You</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">Your one-stop destination for coupons and discounts.</p>
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search for deals, stores, and categories"
            className="w-full max-w-lg px-4 py-3 rounded-l-md focus:outline-none"
          />
          <button className="bg-blue-600 text-white px-6 py-3 rounded-r-md hover:bg-blue-700">Search</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
