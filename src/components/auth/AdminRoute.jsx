import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";
import { isAdmin } from "../../utils/roles";

/**
 * Gate for /admin. This only decides what to *render* -- every admin endpoint
 * re-checks the group server-side, so a tampered localStorage buys an empty
 * dashboard full of 403s, not access.
 */
export default function AdminRoute({ children }) {
  const { user, isLoading, fetchProfile } = useAuthStore();
  const token = localStorage.getItem("access_token");

  // On a hard refresh the persisted profile can be stale or absent; re-fetch so
  // the decision below is made against current groups, not last session's.
  useEffect(() => {
    if (token && !user) fetchProfile();
  }, [token, user, fetchProfile]);

  if (!token) return <Navigate to="/admin" replace />;

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#5B2FC9]" />
      </div>
    );
  }

  return token && user ? children : <Navigate to="/admin" replace />;
}
