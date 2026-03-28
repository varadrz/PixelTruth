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
      <body>{children}</body>
    </html>
  );
}
