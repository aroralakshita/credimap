import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";

const StepEmailPassword = ({ formData, handleChange }) => (
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
        <option value="student">Student</option>
        <option value="nonprofit">Nonprofit</option>
        <option value="company">Company</option>
        <option value="youthorg">Youth Organization</option>
      </Select>
    </FormControl>
    <FormControl id="name" isRequired>
      <FormLabel>Full Name</FormLabel>
      <Input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="John Doe"
      />
    </FormControl>
    <FormControl id="email" isRequired>
      <FormLabel>Email</FormLabel>
      <Input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="email@example.com"
        focusBorderColor="#E8B9AB"
      />
    </FormControl>
    <FormControl id="password" isRequired>
      <FormLabel>Password</FormLabel>
      <Input
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="********"
        focusBorderColor="#E8B9AB"
        type="password"
      />
    </FormControl>
  </VStack>
);

export default StepEmailPassword;