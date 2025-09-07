import React, { useState } from "react";
import { Box, Flex, Heading, FormControl, FormLabel, Input, Button, VStack, Text, Link as ChakraLink, useToast } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ onLogin }) {
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);

      // Save token and user info
      localStorage.setItem('token', res.data.token);
      onLogin(res.data.user);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Login failed. Please check your credentials.');
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
