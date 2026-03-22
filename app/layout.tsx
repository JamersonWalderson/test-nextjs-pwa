import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import OneSignalProvider from "./components/OneSignalProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Teste PWA",
  description: "Aplicação Progressive Web App de teste",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Teste PWA",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Teste PWA",
    title: "Teste PWA",
    description: "Aplicação Progressive Web App de teste",
  },
  twitter: {
    card: "summary",
    title: "Teste PWA",
    description: "Aplicação Progressive Web App de teste",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
  <OneSignalProvider />
  {children}
</body>
    </html>
  );
}
