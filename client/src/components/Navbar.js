import React from "react";
import {
  Box,
  Flex,
  Button,
  HStack,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  VStack,
  useDisclosure,
  useToast,
  Image
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDashboardClick = () => {
    if (!user) {
      toast({
        title: "Access denied",
        description: "You must be logged in to view the dashboard.",
        status: "warning",
        duration: 3000,
        isClosable: true
      });
      return;
    }
    navigate("/studentdashboard");
    onClose();
  };

  return (
    <Box bg="white" px={4} shadow="md" position="sticky" top={0} zIndex={50}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Logo */}
        <Image src="/credimap_logo.png" alt="Logo" boxSize="120px" />

        {/* Desktop nav */}
        <HStack spacing={4} display={{ base: "none", md: "flex" }}>
          <Link to="/"><Button variant="ghost">Home</Button></Link>
          <Link to="/orgmap"><Button variant="ghost">Map</Button></Link>
          <Button variant="ghost" onClick={handleDashboardClick}>Dashboard</Button>

          {user ? (
            <Button colorScheme="red" onClick={() => { logout(); navigate("/auth"); }}>
              Logout
            </Button>
          ) : (
            <Link to="/auth">
              <Button colorScheme="green">Sign In</Button>
            </Link>
          )}
        </HStack>

        {/* Mobile hamburger */}
        <IconButton
          icon={<HamburgerIcon />}
          display={{ base: "flex", md: "none" }}
          onClick={onOpen}
          variant="ghost"
          aria-label="Open menu"
        />
      </Flex>

      {/* Mobile drawer */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody mt={10}>
            <VStack align="stretch" spacing={0}>
    {[
      { label: "Home", path: "/" },
      { label: "Map", path: "/orgmap" },
    ].map((item) => (
      <Box key={item.label}>
        <Link to={item.path} onClick={onClose}>
          <Box
            py={3}
            fontSize="lg"
            fontWeight="medium"
            _hover={{ color: "#E8B9AB" }}
          >
            {item.label}
          </Box>
        </Link>
        <Box h="1px" bg="#E8B9AB" opacity={0.4} />
      </Box>
    ))}

    {/* Dashboard */}
    <Box>
      <Box
        py={3}
        fontSize="lg"
        fontWeight="medium"
        cursor="pointer"
        onClick={handleDashboardClick}
        _hover={{ color: "#E8B9AB" }}
      >
        Dashboard
      </Box>
      <Box h="1px" bg="#E8B9AB" opacity={0.4} />
    </Box>

    {/* Auth action */}
    {user ? (
  <Box
    py={3}
    fontSize="lg"
    fontWeight="medium"
    cursor="pointer"
    color="red.500"
    onClick={() => {
      logout();
      navigate("/auth");
      onClose();
    }}
  >
    Logout
  </Box>
) : (
  <Flex justify="center" mt={6}>
    <Button
      size="sm"
      width="70%"
      maxW="220px"
      borderRadius="full"
      bg="#E8B9AB"
      color="white"
      _hover={{ bg: "#d9a89b" }}
      onClick={() => {
        navigate("/auth");
        onClose();
      }}
    >
      Sign In
    </Button>
  </Flex>
)}
  </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
