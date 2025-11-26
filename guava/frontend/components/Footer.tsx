"use client";

import Link from "next/link";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const topCategories = [
  "Laptops & Computers",
  "SmartPhone",
  "Headphone",
  "Accessories",
  "Printers",
  "Monitors & TVs",
];

const helpLinks = [
  "Contact Us",
  "Payment Options",
  "Delivery Information",
  "Track Order",
  "Returns & Cancellations",
  "Customer Help",
  "About Us",
];

const socialLinks = [
  { name: "Facebook", href: "#" },
  { name: "X", href: "#" },
  { name: "Instagram", href: "#" },
  { name: "YouTube", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="section-wrapper py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-4">
              GUAVASTORES
            </h3>
            <p className="text-sm">
              Guavastores brings you the latest computing, accessories, mobile and smart tech at fair prices. We combine reliable fulfillment, transparent pricing and knowledgeable support to equip homes, offices and campuses with the right technology. We carry genuine IT products from leading global brands and deliver across Kenya with speed and care.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                  aria-label={social.name}
                >
                  <span className="text-xs">{social.name[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">TOP CATEGORIES</h4>
            <ul className="space-y-2 text-sm">
              {topCategories.map((category) => (
                <li key={category}>
                  <Link
                    href="#"
                    className="hover:text-green-400 transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">HELP & SUPPORT</h4>
            <ul className="space-y-2 text-sm">
              {helpLinks.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="hover:text-green-400 transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Talk to Us */}
          <div>
            <h4 className="text-white font-semibold mb-4">TALK TO US</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="font-medium">Live Chat</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneIcon className="h-5 w-5" />
                <span>+254 710 599234</span>
              </li>
              <li className="flex items-center gap-2">
                <EnvelopeIcon className="h-5 w-5" />
                <span>Email: info@guavastores.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPinIcon className="h-5 w-5 mt-0.5" />
                <span>
                  Location: The Bazaar, Moi Avenue, Nairobi Suite 1024
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© 2025 Guava Stores</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-green-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-green-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-green-400 transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

