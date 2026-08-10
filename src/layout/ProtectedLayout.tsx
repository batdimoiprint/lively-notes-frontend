import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { isAxiosError } from "axios";
import { Navigate, Outlet } from "react-router-dom";

// layout/ProtectedLayout.tsx
export default function ProtectedLayout() {
  const { data: user, isLoading, error } = useAuth();
  useRealtimeSync(!!user);

  if (isLoading) return <Spinner />;
  // Only an actual auth rejection (401/403) means "denied". Any other
  // error (503, network blip, timeout) is a backend outage, not a
  // permissions rejection — don't mislabel it as /denied.
  if (error) {
    const status = isAxiosError(error) ? error.response?.status : undefined;
    if (status === 401 || status === 403) {
      return <Navigate to="/denied" replace />;
    }
    return <Navigate to="/" replace />;
  }
  if (!user) return <Navigate to="/" replace />;

  return <Outlet />;
}
