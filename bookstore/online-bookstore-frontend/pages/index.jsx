// pages/index.jsx

import Layout from '@/layouts/Layout';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import StatsBanner from '@/components/home/StatsBanner';
import BookSection from '@/components/home/BookSection';

export default function HomePage() {
  return (
    <Layout>
      <div className="bg-gradient-to-b from-[#e8f0ff] to-white py-12 px-4 sm:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Buy and sell your books for the <span className="text-blue-600">best prices</span>
          </h1>
          <p className="text-gray-600 mb-6">
            Find your favorite reads at unbeatable prices
          </p>
          <SearchBar />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <CategoryFilter />

        <BookSection title="Best Seller Books" category="best-seller" />
        <StatsBanner />
        <BookSection title="Top Rated Books" category="top-rated" />
        <BookSection title="New Releases" category="new-releases" />
        <BookSection title="Most Popular Books" category="most-popular" />
        <BookSection title="Our Suggestion" category="suggestion" />
      </div>
    </Layout>
  );
}
