export default function PromoBanner() {
  return (
    <section className="container mx-auto px-4 py-6">
      <div className="bg-blue-600 rounded-2xl shadow-lg h-32 sm:h-40 flex items-center justify-center">
        <div className="text-white text-center px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-2">Special Offer</h2>
          <p className="text-sm sm:text-base opacity-90">Up to 50% off on selected items</p>
        </div>
      </div>
    </section>
  );
}
