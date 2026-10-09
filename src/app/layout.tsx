import type { Metadata, Viewport } from "next";
import { Gaegu, Nunito } from "next/font/google";
import "./globals.css";

// Handwriting for voice: questions, options, buttons, headlines, speech bubbles.
const gaegu = Gaegu({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-gaegu",
  display: "swap",
});

// Print for reading: story and branch text.
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Louvre Before You Go",
  description:
    "Duolingo for art history. Five minutes a day, one small story about one Louvre masterpiece.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f0e6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${gaegu.variable} ${nunito.variable}`}>
      <body>
        <div className="mx-auto min-h-dvh w-full max-w-[640px] px-4">{children}</div>
      </body>
    </html>
  );
}
