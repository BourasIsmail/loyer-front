import ReactQueryProvider from "@/components/ReactQueryProvider";
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Loyer EN",
  description: "Loyer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <html lang="en">
        <body className={`${inter.variable} font-sans min-h-screen`}>
          {children}
          <Toaster />
        </body>
      </html>
    </ReactQueryProvider>
  );
}
