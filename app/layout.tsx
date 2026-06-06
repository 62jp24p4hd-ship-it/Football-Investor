import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Football Investor",
  description: "Build the most valuable football empire — 2008 to 2028",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}