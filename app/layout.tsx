import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { baseTheme } from "@/lib/content";
import { themeCssVars } from "@/lib/theme";
import { defaultMetadata } from "@/lib/seo";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Inline the published theme on <html> so the first paint is already themed —
  // no flash, and public pages ship zero theme JavaScript.
  const styleVars = themeCssVars(baseTheme) as React.CSSProperties;

  return (
    <html
      lang="en"
      data-motion={baseTheme.motion}
      style={styleVars}
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
