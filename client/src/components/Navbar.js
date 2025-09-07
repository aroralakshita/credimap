import React, { useState } from "react";
import { Box, Flex, Button, HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Navbar() {
  // Simple auth state (replace with real auth later)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
          <Link to="/orgprofile">
            <Button variant="ghost">Orgs</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>

          {/* Single Auth Button */}
          {isLoggedIn ? (
            <Button
              colorScheme="red"
              onClick={() => {
                setIsLoggedIn(false);
                alert("Logged out!");
              }}
            >
              Logout
            </Button>
          ) : (
            <Link to="/register">
              <Button colorScheme="green">Sign Up / Sign In</Button>
            </Link>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}
