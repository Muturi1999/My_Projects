import type { Metadata } from "next";
import { Poppins, Roboto, Courgette } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ProgressScroll from "@/components/common/ProgressScroll";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const courgette = Courgette({
  variable: "--font-courgette",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "GoFly - Visa & Travel Agency",
  description: "Your trusted partner for visa services and travel solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${roboto.variable} ${courgette.variable} antialiased`}
      >
        {children}
        <ProgressScroll />
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
