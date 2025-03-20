import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, isGuestMode } = useAuth();
  const location = useLocation();

  // Add debugging logs to track what's happening
  useEffect(() => {
    console.log("ProtectedRoute state:", { 
      isAuthenticated, 
      loading, 
      isGuestMode, 
      path: location.pathname 
    });
  }, [isAuthenticated, loading, isGuestMode, location]);

  if (loading) {
    // Return a loading state while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-2 w-24 bg-muted-foreground/30 rounded mb-2 mx-auto"></div>
          <div className="h-2 w-16 bg-muted-foreground/30 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  // If not authenticated and not in guest mode, redirect to landing
  if (!isAuthenticated && !isGuestMode) {
    console.log("Redirecting to landing from ProtectedRoute");
    return <Navigate to="/landing" replace />;
  }

  // User is either authenticated or in guest mode, show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
