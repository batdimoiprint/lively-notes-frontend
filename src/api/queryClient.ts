import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      enabled: true,
      staleTime: Infinity,
      retry: 2,
      refetchOnWindowFocus: true,
      networkMode: "offlineFirst",
    },
  },
});
