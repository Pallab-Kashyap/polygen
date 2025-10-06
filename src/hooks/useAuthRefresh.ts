"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useAuthRefresh() {
  const router = useRouter();

  const refreshAuth = useCallback(() => {
    // Force router to refresh and re-run middleware
    router.refresh();
  }, [router]);

  const navigateWithAuth = useCallback((path: string) => {
    // Use window.location for guaranteed middleware execution
    window.location.href = path;
  }, []);

  return { refreshAuth, navigateWithAuth };
}
