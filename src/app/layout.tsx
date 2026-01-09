import type { Metadata } from "next";
import "./globals.css";
import { OrbitNav, PageTransition } from "@/components/navigation";

export const metadata: Metadata = {
  title: "Artifact Analyzer",
  description: "Advanced artifact analysis and appraisal system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PageTransition>
          {children}
        </PageTransition>
        <OrbitNav />
      </body>
    </html>
  );
}
