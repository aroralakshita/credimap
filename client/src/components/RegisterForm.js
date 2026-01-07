import React, { useState } from "react";
import {
  Box, FormControl, FormLabel, Input, Button, VStack, 
  useToast
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
        </VStack>
      </form>
    </Box>
  );
}

export default RegisterForm;
