import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Auralis — See what hearing sounds like",
  description:
    "A guided listening comparison that helps families explore how hearing profiles, distance, and background sound can shape an everyday conversation.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
