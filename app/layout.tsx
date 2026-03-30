import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PixelTruth — AI vs Real Image Detector",
  description:
    "Detect AI-generated images instantly in your browser. No API. No data sent. 100% private.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/PixelTruth/coi-serviceworker.js" async />
      </head>
      <body>{children}</body>
    </html>
  );
}
