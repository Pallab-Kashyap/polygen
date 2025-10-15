import { useState, useCallback } from "react";

export function useApi<T, Args extends any[]>(
  apiFunction: (...args: Args) => Promise<T>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);
        const response: any = await apiFunction(...args);

        if (response && typeof response === "object" && "data" in response) {
          return response.data as T;
        }

        return response as T;
      } catch (err: any) {
        // Handle 401 errors - redirect to login
        if (err?.response?.status === 401) {
          if (
            typeof window !== "undefined" &&
            window.location.pathname.startsWith("/admin")
          ) {
            if (!window.location.pathname.includes("/admin/login")) {
              window.location.href = "/admin/login";
            }
          }
        }

        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  return { execute, loading, error } as const;
}
