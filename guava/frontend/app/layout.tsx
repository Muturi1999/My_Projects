import type { Metadata } from "next";
import { Outfit, Public_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GUAVASTORES - Electronics & Tech",
  description: "Shop the latest electronics, laptops, smartphones, and tech accessories at GUAVASTORES",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${publicSans.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
