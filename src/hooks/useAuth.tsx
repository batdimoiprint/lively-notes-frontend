import { GetMe } from "@/api/auth";

import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  return useQuery({
    queryKey: ["auth"],
    queryFn: GetMe,
    retry: false,
    staleTime: 15 * 60 * 1000,
  });
}
