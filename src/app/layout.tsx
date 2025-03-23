import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Base64 Encoder/Decoder - Convert Text & Images",
  description: "A free online tool to encode and decode text and images to/from Base64 format. Easy to use, secure, and works directly in your browser.",
  metadataBase: new URL("https://base64-encoder.com"),
  keywords: ["base64", "encoder", "decoder", "text encoder", "image encoder", "base64 converter", "encoding tool"],
  authors: [{ name: "Base64 Encoder Team" }],
  creator: "Base64 Encoder Team",
  publisher: "base64-encoder.com",
  alternates: {
    canonical: "https://base64-encoder.com",
  },
  openGraph: {
    title: "Base64 Encoder/Decoder - Convert Text & Images Online",
    description: "Free online tool to encode and decode text and images to/from Base64 format. No data is stored on servers.",
    url: "https://base64-encoder.com",
    siteName: "Base64 Encoder",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://base64-encoder.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Base64 Encoder/Decoder Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base64 Encoder/Decoder - Convert Text & Images",
    description: "Free tool to encode/decode Base64 content. Works in your browser with no server storage.",
    images: ["https://base64-encoder.com/twitter-image.png"],
  },
  viewport: "width=device-width, initial-scale=1",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9354746037074515"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
