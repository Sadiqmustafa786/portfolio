import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { ROUTES } from "../../utils/constants";

export default function ProtectedRoute() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.ADMIN_LOGIN} state={{ from: location }} replace />
    );
  }

  return <Outlet />;
}
