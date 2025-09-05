import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 text-gray-800">{children}</main>
      <Footer />
    </>
  );
}
