import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Flex, Button, HStack, Text } from "@chakra-ui/react";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <Box bg="white" px={4} shadow="md" position="sticky" top={0} zIndex={50}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Logo */}
        <Box fontWeight="bold" fontSize="xl" color="blue.600">
          Nonprofit Review
        </Box>

        {/* Links */}
        <HStack spacing={4}>
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link to="/orgmap">
            <Button variant="ghost">Map</Button>
          </Link>
          {/*<Link to="/orgprofile">
            <Button variant="ghost">Orgs</Button>
          </Link>*/}
          <Link to="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>

          {/* Auth Button */}
          {user ? (
            <HStack spacing={3}>
              <Button
                colorScheme="red"
                onClick={() => {
                  onLogout();       // call App.js logout
                  navigate("/login");
                }}
              >
                Logout
              </Button>
            </HStack>
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
