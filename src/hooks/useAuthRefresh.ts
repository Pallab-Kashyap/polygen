"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useAuthRefresh() {
  const router = useRouter();

  const refreshAuth = useCallback(() => {
    router.refresh();
  }, [router]);

  const navigateWithAuth = useCallback((path: string) => {
    window.location.href = path;
  }, []);

  return { refreshAuth, navigateWithAuth };
}
