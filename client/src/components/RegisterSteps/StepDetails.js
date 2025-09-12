import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";

const StepDetails = ({ formData, handleChange }) => {
  const categoryOptions = [
    "astronomy","biology","business","chemistry","computer science",
    "data science","education","engineering","environmental science",
    "history","law","literature","mathematics","medicine","neuroscience",
    "philosophy","physics","political science","psychology","social work",
    "sociology","STEM","technology"
  ].sort();

  const formatOptions = ["hybrid", "in-person", "remote"];

  return (
    <VStack spacing={4}>
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

      <FormControl id="description" isRequired>
        <FormLabel>Description</FormLabel>
        <Input
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description..."
        />
      </FormControl>
    </VStack>
  );
};

export default StepDetails;