import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      enabled: true,
      staleTime: 0,
      retry: 2,
      refetchOnWindowFocus: true,
      networkMode: "always",
    },
  },
});
