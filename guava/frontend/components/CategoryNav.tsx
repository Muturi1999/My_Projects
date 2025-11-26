"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { categoryDropdowns } from "@/lib/data/categories";

const categories = [
  "Laptops & Computers",
  "Accessories",
  "Monitors & TVs",
  "Smartphones",
  "Printers",
  "Drives & Storage",
  "Gaming",
];

// All Categories dropdown structure based on electronics store
const allCategoriesDropdown = {
  "Computers & Tablets": {
    links: [
      "Laptops & Desktops",
      "Tablets",
      "Monitors",
      "Laptops",
      "Accessories",
      "Computer Component",
      "PC Gaming",
      "Chromebook",
      "Macbook",
      "iMac",
      "Windows Laptops",
      "Printers & Ink",
      "Restored Computers",
    ],
  },
  "Cell Phone": {
    links: [
      "Smartphone",
      "iPhone",
      "Samsung Galaxy",
      "Prepaid Phones",
      "Unlocked Phones",
      "AT&T",
      "Verizon",
    ],
  },
  "TV & Home Theater": {
    links: [
      "Television",
      "55\" TVs",
      "65\" TVs",
      "OLED TVs",
      "QLED TVs",
      "Home Theater Systems",
    ],
  },
  "Audio": {
    links: [
      "Headphones",
      "AirPods",
      "Gaming Headsets",
      "Kids' Headphones",
      "Wireless Earbuds",
      "Bluetooth Speakers",
      "Portable Speakers",
      "Professional Speakers",
      "Waterproof Speakers",
      "Speakers",
    ],
  },
  "Camera & Video": {
    links: [
      "Camera",
      "Accessories",
      "Camera & Lenses",
      "Drones",
      "Security Cameras",
      "Camcorders",
    ],
  },
  "Video Games": {
    links: [
      "Xbox Series",
      "Playstation 4",
      "Playstation 5",
      "Gaming Headsets",
      "Accessories",
      "PC Gaming",
      "Games",
    ],
  },
  "Smart Home": {
    links: [
      "Smart Home",
      "Security Cameras",
      "Smart Devices",
      "Home Automation",
    ],
  },
  "Wearables": {
    links: [
      "Smartwatches",
      "Apple Watch",
      "Fitness Trackers",
      "Smart Bands",
    ],
  },
  "Storage & Drives": {
    links: [
      "External Hard Drives",
      "SSD Hard Drives",
      "Internal Hard Drives",
      "USB Flash Drives",
      "Memory Cards",
      "Network Attached Storage (NAS)",
      "Servers",
    ],
  },
  "Networking": {
    links: [
      "WiFi & Networking",
      "Routers",
      "Modems",
      "Network Switches",
      "Cables & Adapters",
    ],
  },
  "Accessories": {
    links: [
      "Laptop Bags & Cases",
      "Keyboards & Mouse",
      "Webcams",
      "Batteries & Cables",
      "Chargers",
      "Cables & Adapters",
      "Docking Stations",
    ],
  },
  "Gaming": {
    links: [
      "Gaming Laptops",
      "Gaming Desktops",
      "Gaming Monitors",
      "Gaming Keyboards",
      "Gaming Mouse",
      "Gaming Chairs",
      "Gaming Accessories",
    ],
  },
  "Kid Electronics": {
    links: [
      "Kids' Tablets",
      "Kids' Headphones",
      "Educational Electronics",
      "Kid-Friendly Devices",
    ],
  },
  "Tech Gifts": {
    links: [
      "Gift Cards",
      "Tech Bundles",
      "Special Offers",
    ],
  },
};

export function CategoryNav() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showAllCategoriesDropdown, setShowAllCategoriesDropdown] = useState(false);

  const handleMouseEnter = (category: string) => {
    if (categoryDropdowns[category]) {
      setActiveDropdown(category);
    }
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <nav
      className="bg-white border-b border-gray-200 relative z-40"
      onMouseLeave={handleMouseLeave}
    >
      <div className="section-wrapper">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-4 md:space-x-6 overflow-x-auto pb-2 md:pb-0">
            {/* All Categories with Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowAllCategoriesDropdown(true)}
              onMouseLeave={() => setShowAllCategoriesDropdown(false)}
            >
              <Link
                href="#"
                className={`flex items-center gap-1 text-sm font-medium transition-colors whitespace-nowrap ${
                  showAllCategoriesDropdown
                    ? "text-[#A7E059]"
                    : "text-gray-700 hover:text-[#A7E059]"
                }`}
              >
                All Categories
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform ${
                    showAllCategoriesDropdown ? "rotate-180" : ""
                  }`}
                />
              </Link>
              {/* All Categories Dropdown */}
              <AnimatePresence>
                {showAllCategoriesDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[800px] max-h-[600px] overflow-y-auto"
                  >
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Object.entries(allCategoriesDropdown).map(([category, data]) => (
                          <div key={category} className="space-y-3">
                            <h3 className="font-bold text-gray-900 text-base border-b border-gray-200 pb-2">
                              {category}
                            </h3>
                            <ul className="space-y-2">
                              {data.links.map((link, index) => (
                                <li key={index}>
                                  <Link
                                    href={`/category/${link.toLowerCase().replace(/\s+/g, "-").replace(/[&'"]/g, "")}`}
                                    className="text-sm text-gray-600 hover:text-[#A7E059] transition-colors block"
                                  >
                                    {link}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other Categories */}
            {categories.map((category) => {
              const hasDropdown = categoryDropdowns[category];
              const isActive = activeDropdown === category;

              return (
                <div
                  key={category}
                  className="relative"
                  onMouseEnter={() => hasDropdown && handleMouseEnter(category)}
                >
                  <Link
                    href="#"
                    className={`flex items-center gap-1 text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? "text-[#A7E059]"
                        : "text-gray-700 hover:text-[#A7E059]"
                    }`}
                  >
                    {category}
                    {hasDropdown && (
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform ${
                          isActive ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
          
          {/* WhatsApp and Phone on the right */}
          <div className="flex items-center gap-4 text-sm font-medium whitespace-nowrap hidden md:flex">
            <a
              href="https://wa.me/254710599234"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-500 hover:text-green-600 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </a>
            <a
              href="tel:+254710599234"
              className="text-gray-700 hover:text-[#A7E059] transition-colors"
            >
              +254 710 599234
            </a>
          </div>
        </div>
      </div>

      {/* Dropdown Menu for other categories */}
      <AnimatePresence>
        {activeDropdown && categoryDropdowns[activeDropdown] && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 bg-white shadow-lg border-t border-gray-200"
            onMouseEnter={() => setActiveDropdown(activeDropdown)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="section-wrapper py-6">
              <div
                className={`grid gap-8 ${
                  categoryDropdowns[activeDropdown].columns.length === 4
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                    : categoryDropdowns[activeDropdown].columns.length === 3
                    ? "grid-cols-1 md:grid-cols-3"
                    : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {categoryDropdowns[activeDropdown].columns.map(
                  (column, index) => (
                    <div key={index} className="space-y-4">
                      <h3 className="font-bold text-gray-900 text-base">
                        {column.title}
                      </h3>
                      <ul className="space-y-2">
                        {column.links.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <Link
                              href="#"
                              className="text-sm text-gray-600 hover:text-[#A7E059] transition-colors"
                            >
                              {link}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
