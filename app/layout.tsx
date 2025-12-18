import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UHNW Liquidity Intelligence Platform",
  description: "Early liquidity signals detection for UHNW clients",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
