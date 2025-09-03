import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  VStack,
  Text,
  Link as ChakraLink,
  useToast,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaCity } from "react-icons/fa";
import axios from "axios";

function Register() {
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
    city: "",
    state: "",
    country: "",
    description: "",
    category: "",
    format: "",
  });

  const categoryOptions = [
    "astronomy","biology","business","chemistry","computer science",
    "data science","education","engineering","environmental science",
    "history","law","literature","mathematics","medicine","neuroscience",
    "philosophy","physics","political science","psychology","social work",
    "sociology","stem","technology"
  ].sort();

  const formatOptions = ["hybrid", "in-person", "remote"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        role: formData.role,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        location: {
          city: formData.city,
          state: formData.state,
          country: formData.country,
          description: formData.description,
        },
        category: formData.role === "organization" ? formData.category : "",
        format: formData.role === "organization" ? formData.format : "",
      };
      await axios.post("http://localhost:5000/api/auth/register", payload);
      toast({
        title: "Registration successful!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
    } catch (err) {
      toast({
        title: "Registration failed",
        description: err.response?.data?.message || "Try again",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      fontFamily="Ubuntu, sans-serif"
      bgGradient="linear(to-tr, #E8B9AB, #D6EFFF, #F4E285)"
      p={6}
    >
      <Box bg="white" p={10} rounded="3xl" shadow="2xl" w="full" maxW="md">
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg" color="#E8B9AB">Register</Heading>
          <Text fontSize="sm">
            Already a member?{" "}
            <ChakraLink as={Link} to="/login" color="#D6EFFF" fontWeight="bold">
              Sign In
            </ChakraLink>
          </Text>
        </Flex>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="role" isRequired>
              <FormLabel>Role</FormLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Select role"
                focusBorderColor="#E8B9AB"
              >
                <option value="organization">Organization</option>
                <option value="student">Student</option>
              </Select>
            </FormControl>

            <FormControl id="name" isRequired>
              <FormLabel>Full Name</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaUser} color="#E8B9AB" />
                </InputLeftElement>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  focusBorderColor="#E8B9AB"
                />
              </InputGroup>
            </FormControl>

            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaEnvelope} color="#E8B9AB" />
                </InputLeftElement>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  focusBorderColor="#E8B9AB"
                />
              </InputGroup>
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaLock} color="#E8B9AB" />
                </InputLeftElement>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  focusBorderColor="#E8B9AB"
                />
              </InputGroup>
            </FormControl>

            <FormControl id="city" isRequired>
              <FormLabel>City</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaCity} color="#E8B9AB" />
                </InputLeftElement>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="New York"
                  focusBorderColor="#E8B9AB"
                />
              </InputGroup>
            </FormControl>

            <FormControl id="state">
              <FormLabel>State (optional)</FormLabel>
              <Input
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="California"
                focusBorderColor="#E8B9AB"
              />
            </FormControl>

            <FormControl id="country" isRequired>
              <FormLabel>Country</FormLabel>
              <Input
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="USA"
                focusBorderColor="#E8B9AB"
              />
            </FormControl>

            {formData.role === "organization" && (
              <>
                <FormControl id="description" isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description..."
                    focusBorderColor="#E8B9AB"
                  />
                </FormControl>

                <FormControl id="category" isRequired>
                  <FormLabel>Category</FormLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Select category"
                    focusBorderColor="#E8B9AB"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat[0].toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl id="format" isRequired>
                  <FormLabel>Format</FormLabel>
                  <Select
                    name="format"
                    value={formData.format}
                    onChange={handleChange}
                    placeholder="Select format"
                    focusBorderColor="#E8B9AB"
                  >
                    {formatOptions.map((fmt) => (
                      <option key={fmt} value={fmt}>
                        {fmt[0].toUpperCase() + fmt.slice(1)}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

            <Button
              type="submit"
              w="full"
              bgGradient="linear(to-r, #E8B9AB, #D6EFFF)"
              color="white"
              _hover={{ bgGradient: "linear(to-r, #D6EFFF, #F4E285)" }}
              mt={2}
            >
              Register
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
}

export default Register;
