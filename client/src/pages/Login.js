import React, { useState } from "react";
import { Box, Flex, Heading, FormControl, FormLabel, Input, Button, VStack, Text, Link as ChakraLink, useToast } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/login", formData);
      toast({ title: "Logged in successfully!", status: "success", duration: 3000, isClosable: true });
      navigate("/dashboard"); // Redirect after login
    } catch (err) {
      toast({ title: "Login failed", description: err.response?.data?.message || "Try again", status: "error", duration: 4000, isClosable: true });
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bgGradient="linear(to-b, gray.100, gray.50)" px={4}>
      <Box bg="white" p={10} rounded="2xl" shadow="2xl" w={{ base: "full", md: "400px" }}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg" color="blue.600">Sign In</Heading>
          <Text fontSize="sm">
            Don’t have an account?{" "}
            <ChakraLink as={Link} to="/register" color="blue.500" fontWeight="bold">Register</ChakraLink>
          </Text>
        </Flex>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} focusBorderColor="blue.400" />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" name="password" value={formData.password} onChange={handleChange} focusBorderColor="blue.400" />
            </FormControl>

            <Button colorScheme="blue" type="submit" w="full">Sign In</Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
}

export default Login;
