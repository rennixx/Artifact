"use client";

// Scan page - redirects to home for now, but could be used for multi-scan interface
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ScanPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page (main scan interface)
    router.replace("/");
  }, [router]);

  return null;
}
