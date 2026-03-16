import React, { useState } from "react";
import {
  Box, FormControl, FormLabel, Input, Button, VStack, 
  useToast, Divider, Text
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function RegisterForm() {
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) =>({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
const payload = {
  name: formData.name,
  email: formData.email,
  password: formData.password,
};
      const API_BASE = process.env.REACT_APP_API_URL || "https://credimap-backend.onrender.com";
      const res = await axios.post(`${API_BASE}/api/auth/register`, payload);
      
      login(res.data.user, res.data.token);

      toast({
        title: "Account created!",
        description: "Let's complete your profile",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/");

    } catch (err) {
      console.error("Registration error:", err);
      toast({
        title: "Registration failed",
        description: err.response?.data?.message || "Try again",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    const API_BASE = process.env.REACT_APP_API_URL || "https://credimap-backend.onrender.com";
    // Store that this is a registration flow
    sessionStorage.setItem('authFlow', 'register');
    window.location.href = `${API_BASE}/api/auth/google`;
  }

  return (
    <Box bg="white" p={10} rounded="3xl" shadow="2xl" w="full" maxW="md">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
         <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
            />
          </FormControl>

          <Button
            type="submit"
            w="full"
            bgGradient="linear(to-r, #E8B9AB, #D6EFFF)"
            color="white"
            _hover={{ bgGradient: "linear(to-r, #D6EFFF, #F4E285)" }}
            isLoading={isLoading}
            size="lg"
          >
            Create Account
          </Button>

          <Box position="relative" w="full" py={2}>
            <Divider />
            <Text
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              bg="white"
              px={3}
              fontSize="sm"
              color="gray.500"
            >
              OR
            </Text>
          </Box>

          <Button
            onClick={handleGoogleRegister}
            w="full"
            variant="outline"
            borderColor="gray.300"
            leftIcon={
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
            }
            _hover={{ bg: "gray.50" }}
          >
            Continue with Google
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default RegisterForm;
