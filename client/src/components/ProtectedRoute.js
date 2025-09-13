import { Navigate, useLocation } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const toast = useToast();
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      toast({
        title: "Access denied",
        description: "You must be logged in to view this page.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [token, toast]);

  if (!token) {
    return <Navigate to="/orgmap" state={{ from: location }} replace />;
  }

  return children;
}
