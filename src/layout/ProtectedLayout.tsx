import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

// layout/ProtectedLayout.tsx
export default function ProtectedLayout() {
  const { data: user, isLoading, error } = useAuth();

  if (isLoading) return <Spinner />;
  if (!user) return <Navigate to="/" replace />;
  if (error) return <Navigate to="/denied" replace />;

  return <Outlet />;
}
