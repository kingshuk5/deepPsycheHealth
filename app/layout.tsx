import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "DeepPsyche Health — Psychological Screening Dashboard",
  description:
    "Multi-modal psychological and behavioral screening combining facial expression analysis, NLP sentiment review, and the BDI-II questionnaire.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={syne.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
