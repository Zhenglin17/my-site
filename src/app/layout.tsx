import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = localFont({
  src: "../../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export const metadata: Metadata = {
  title: {
    default: "Zhenglin Zhang",
    template: "%s | Zhenglin Zhang",
  },
  description: "Software Engineer",
  openGraph: {
    title: "Zhenglin Zhang",
    description: "Software Engineer",
    siteName: "Zhenglin Zhang",
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${calSans.variable}`}>
      <body className="bg-[#c49a3c] antialiased">
        {children}
      </body>
    </html>
  );
}
