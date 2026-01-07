import React, { useState } from "react";
import {
  Box, FormControl, FormLabel, Input, Button, VStack, useToast
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
const API_BASE = process.env.REACT_APP_API_URL || "https://credimap-backend.onrender.com";

const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password }, {
  headers: { "Content-Type": "application/json" }
});



      // save user globally
      login(res.data.user, res.data.token);

      toast({
        title: "Login successful!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/");

    } catch (err) {
      toast({
        title: "Login failed",
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
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              focusBorderColor="#E8B9AB"
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              focusBorderColor="#E8B9AB"
            />
          </FormControl>

          <Button
            type="submit"
            w="full"
            bgGradient="linear(to-r, #E8B9AB, #D6EFFF)"
            color="white"
            _hover={{ bgGradient: "linear(to-r, #D6EFFF, #F4E285)" }}
          >
            Login
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
