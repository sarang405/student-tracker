import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 gap-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-slate-400 animate-pulse">
          Verifying session...
        </span>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}