import React from "react";
import { FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";

const StepOrganization = ({ formData, handleChange }) => (
  <VStack spacing={4}>
    <FormControl id="city" isRequired>
      <FormLabel>City</FormLabel>
      <Input
        name="city"
        value={formData.city}
        onChange={handleChange}
        placeholder="New York"
      />
    </FormControl>

    <FormControl id="state">
      <FormLabel>State (optional)</FormLabel>
      <Input
        name="state"
        value={formData.state}
        onChange={handleChange}
        placeholder="California"
      />
    </FormControl>

    <FormControl id="country" isRequired>
      <FormLabel>Country</FormLabel>
      <Input
        name="country"
        value={formData.country}
        onChange={handleChange}
        placeholder="USA"
      />
    </FormControl>
  </VStack>
);

export default StepOrganization;