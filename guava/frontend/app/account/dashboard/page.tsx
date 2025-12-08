"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBagIcon,
  ShoppingCartIcon,
  HeartIcon,
  TicketIcon,
  QuestionMarkCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { ProfileWizard } from "@/components/ProfileWizard";
import { useOrders } from "@/lib/hooks/use-orders";
import { useCart } from "@/lib/hooks/use-cart";
import { useWishlist } from "@/lib/hooks/use-wishlist";

type DashboardTab = "orders" | "cart" | "wishlist" | "vouchers" | "help" | "settings";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>("orders");
  const [showProfileWizard, setShowProfileWizard] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [username, setUsername] = useState("User"); // TODO: Get from auth context
  const { orders = [] } = useOrders();
  const { items: cartItems = [] } = useCart();
  const { ids: wishlistIds = [] } = useWishlist();

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  const handleSignOut = () => {
    // TODO: Implement sign out logic (clear auth tokens, etc.)
    console.log("Signing out...");
    router.push("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">My Orders</h2>
            {!orders || orders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">You haven't placed any orders yet.</p>
                <Link
                  href="/"
                  className="mt-4 inline-block text-[#98C243] hover:text-[#7FA836] font-medium"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-[#98C243] transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.items.length} item(s) • KSh {order.total.toLocaleString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                        {order.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );

      case "cart":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">My Cart</h2>
            {!cartItems || cartItems.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <ShoppingCartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Your cart is empty.</p>
                <Link
                  href="/"
                  className="mt-4 inline-block text-[#98C243] hover:text-[#7FA836] font-medium"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600 mb-4">
                  You have {cartItems.length} item(s) in your cart.
                </p>
                <Link
                  href="/cart"
                  className="inline-block bg-[#98C243] hover:bg-[#7FA836] text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  View Cart
                </Link>
              </div>
            )}
          </div>
        );

      case "wishlist":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">My Wishlist</h2>
            {!wishlistIds || wishlistIds.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <HeartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Your wishlist is empty.</p>
                <Link
                  href="/"
                  className="mt-4 inline-block text-[#98C243] hover:text-[#7FA836] font-medium"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600 mb-4">
                  You have {wishlistIds.length} item(s) in your wishlist.
                </p>
                <Link
                  href="/wishlist"
                  className="inline-block bg-[#98C243] hover:bg-[#7FA836] text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  View Wishlist
                </Link>
              </div>
            )}
          </div>
        );

      case "vouchers":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">My Vouchers</h2>
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <TicketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">You don't have any vouchers yet.</p>
            </div>
          </div>
        );

      case "help":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Help & Support</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
                <p className="text-gray-600">Phone: +254 710 599234</p>
                <p className="text-gray-600">Email: info@guavastores.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Common Questions</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• How to track my order?</li>
                  <li>• How to return a product?</li>
                  <li>• Payment options</li>
                  <li>• Delivery information</li>
                </ul>
              </div>
              <Link
                href="/contact"
                className="inline-block text-[#98C243] hover:text-[#7FA836] font-medium"
              >
                View All Help Topics →
              </Link>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Settings</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Account Settings</h3>
                <p className="text-gray-600 mb-4">
                  Manage your account preferences and privacy settings.
                </p>
                <button
                  onClick={() => setShowProfileWizard(true)}
                  className="bg-[#98C243] hover:bg-[#7FA836] text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      {/* Dashboard Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-white border-r border-gray-200 flex flex-col lg:h-[calc(100vh-80px)] lg:sticky lg:top-20">
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2 flex lg:flex-col overflow-x-auto lg:overflow-x-visible">
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full lg:w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === "orders"
                    ? "bg-[#F0F9E8] text-[#98C243] font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ShoppingBagIcon className="h-5 w-5" />
                <span>Orders</span>
              </button>

              <button
                onClick={() => setActiveTab("cart")}
                className={`w-full lg:w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === "cart"
                    ? "bg-[#F0F9E8] text-[#98C243] font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span>Cart</span>
              </button>

              <button
                onClick={() => setActiveTab("wishlist")}
                className={`w-full lg:w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === "wishlist"
                    ? "bg-[#F0F9E8] text-[#98C243] font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <HeartIcon className="h-5 w-5" />
                <span>Wishlist</span>
              </button>

              <button
                onClick={() => setActiveTab("vouchers")}
                className={`w-full lg:w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === "vouchers"
                    ? "bg-[#F0F9E8] text-[#98C243] font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <TicketIcon className="h-5 w-5" />
                <span>Vouchers</span>
              </button>

              <button
                onClick={() => setActiveTab("help")}
                className={`w-full lg:w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === "help"
                    ? "bg-[#F0F9E8] text-[#98C243] font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <QuestionMarkCircleIcon className="h-5 w-5" />
                <span>Help</span>
              </button>
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 p-4 space-y-2">
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full lg:w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === "settings"
                  ? "bg-[#F0F9E8] text-[#98C243] font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Cog6ToothIcon className="h-5 w-5" />
              <span>Settings</span>
            </button>

            <button
              onClick={handleSignOut}
              className="w-full lg:w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#98C243] hover:bg-[#F0F9E8] transition-colors font-medium whitespace-nowrap"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <div className="flex items-center gap-2 lg:gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs lg:text-sm text-gray-600">{greeting},</p>
                <p className="text-sm lg:text-base font-semibold text-gray-900">{username}</p>
              </div>
              <button
                onClick={() => setShowProfileWizard(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="User Profile"
              >
                <UserIcon className="h-5 w-5 lg:h-6 lg:w-6 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl">{renderContent()}</div>
          </div>
        </div>
      </div>

      {/* Profile Wizard Modal */}
      {showProfileWizard && (
        <ProfileWizard
          isOpen={showProfileWizard}
          onClose={() => setShowProfileWizard(false)}
        />
      )}
    </main>
  );
}
