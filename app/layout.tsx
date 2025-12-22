import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "./components/layout/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
