import React, { useEffect, useRef} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast, Box, Spinner, VStack, Text } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return; // ✅ exit if already ran
    hasRun.current = true;

    const token = searchParams.get("token");
    const error = searchParams.get("error");
    const userParam = searchParams.get("user");

    if (error) {
      toast({
        title: "Authentication failed",
        description: error,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      navigate("/login");
      return;
    }

    if (token && userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        login(userData, token);
          
        toast({
          title: "Login successful!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/"); 
      } catch (err) {
        console.error("Error parsing user data:", err);
        toast({
          title: "Authentication error",
          description: "Failed to process login data",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        navigate("/login");
      }
    } else {
      toast({
        title: "Authentication error",
        description: "Missing credentials",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      navigate("/login");
    }
}, []);


  return (
    <Box 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      bg="gray.50"
    >
      <VStack spacing={4}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
        <Text fontSize="lg" color="gray.600">
          Completing authentication...
        </Text>
      </VStack>
    </Box>
  );
}