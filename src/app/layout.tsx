import ReactQueryProvider from "@/components/ReactQueryProvider";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
        <body className={` bg-cover lg:block  bg-[url('/backgr.jpg')] `}>
          {children}
          <Toaster />
        </body>
      </html>
    </ReactQueryProvider>
  );
}
