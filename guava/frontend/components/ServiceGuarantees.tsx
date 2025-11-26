"use client";

import { motion } from "framer-motion";
import {
  TruckIcon,
  ArrowPathIcon,
  LockClosedIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const guarantees = [
  {
    icon: TruckIcon,
    title: "FAST DELIVERY",
    description: "Delivery in 24H",
  },
  {
    icon: ArrowPathIcon,
    title: "24 HOURS RETURN",
    description: "100% money-back guarantee",
  },
  {
    icon: LockClosedIcon,
    title: "SECURE PAYMENT",
    description: "Your money is safe",
  },
  {
    icon: PhoneIcon,
    title: "SUPPORT 24/7",
    description: "Live contact/message",
  },
];

export function ServiceGuarantees() {
  return (
    <section className="py-12 bg-white">
      <div className="section-wrapper">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((guarantee, index) => {
            const Icon = guarantee.icon;
            return (
              <motion.div
                key={guarantee.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-none border border-gray-200"
              >
                <div className="w-16 h-16 bg-[#A7E059]/20 rounded-none flex items-center justify-center mb-4">
                  <Icon className="h-8 w-8 text-[#A7E059]" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">
                  {guarantee.title}
                </h3>
                <p className="text-sm text-gray-600">{guarantee.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

