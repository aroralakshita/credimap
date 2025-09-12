import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Flex, Button, HStack, useToast } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
    const toast = useToast();
  const navigate = useNavigate();


  // Determine correct dashboard route
const dashboardLink = user
    ? ["nonprofit", "company", "youthorg"].includes(user.role)
      ? "/dashboard"          // Org dashboard
      : "/studentdashboard"   // Student dashboard
    : "/auth";                // If not logged in


  const handleDashboardClick = () => {
    if (!user) {
      toast({
        title: "Failed to load dashboard",
        description: "You must be logged in to view this page.",
        status: "error",
        duration: 4000,
        isClosable: true
      });
      return;
    }
    navigate(dashboardLink);
  };

  return (
    <Box bg="white" px={4} shadow="md" position="sticky" top={0} zIndex={50}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box fontWeight="bold" fontSize="xl" color="blue.600">
          Nonprofit Review
        </Box>

        <HStack spacing={4}>
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link to="/orgmap">
            <Button variant="ghost">Map</Button>
          </Link>

          {/* Dashboard always visible */}
            <Button variant="ghost" onClick={handleDashboardClick}>Dashboard</Button>

          {user ? (
            <Button
              colorScheme="red"
              onClick={() => {
                logout();
                navigate("/auth");
              }}
            >
              Logout
            </Button>
          ) : (
            <Link to="/auth">
              <Button colorScheme="green">Sign Up / Sign In</Button>
            </Link>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}
