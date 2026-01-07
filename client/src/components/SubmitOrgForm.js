import React, { useState } from "react";
import {
  Box, FormControl, FormLabel, Input, Select, Textarea, Button, 
  VStack, Heading, useToast, Text, SimpleGrid
} from "@chakra-ui/react";
import axios from "axios";

export default function SubmitOrgForm() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    format: "",
    description: "",
    instagram: "",
    linktree:"",
    tiktok: "",
    linkedin:"",
    website: "",
    location: {
      city: "",
      state: "",
      country: ""
    },
    submitterName: "",
    submitterLinkedIn: ""
  });


    const categoryOptions = [
    'Astronomy','Arts','Biology','Business','Chemistry','Computer science','Community service','Data science',
    'Education','Engineering','Environmental science','History','Law','Literature',
    'Mathematics','Medicine','Neuroscience','Philosophy','Physics','Political science',
    'Psychology','Social work','Sociology','STEM','Technology'
  ].sort();


  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } 

  // Social platforms handling
  if (["instagram", "tiktok", "linkedin", "linktree"].includes(name)) {
    let cleanValue = value.trim();

    const extractors = {
      instagram: "instagram.com/",
      tiktok: "tiktok.com/@",
      linkedin: "linkedin.com/in/",
      linktree: "linktr.ee/"
    };

    const key = extractors[name];

    if (cleanValue.includes(key)) {
      cleanValue = cleanValue
        .split(key)[1]
        ?.split("/")[0]
        ?.split("?")[0] || cleanValue;
    }

    cleanValue = cleanValue.replace(/^@/, "");

    setFormData(prev => ({
      ...prev,
      [name]: cleanValue
    }));

    return;
  }

  // Default handling
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE}/api/orgs/submit`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      toast({
        title: "Organization submitted!",
        description: "Thanks for helping build our database.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        name: "",
        category: "",
        format: "",
        description: "",
        instagram: "",
        linktree: "",
        tiktok: "",
        linkedin: "",
        website: "",
        location: { city: "", state: "", country: "" },
      });

    } catch (err) {
      console.error("Submit error:", err);
      toast({
        title: "Submission failed",
        description: err.response?.data?.message || "Please try again",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box maxW="900px" mx="auto" p={6} bg="white" rounded="3xl" shadow="2xl">
      <Heading mb={2} size="lg" textAlign="center" color="#E8B9AB">
        Know an Organization?
      </Heading>
      <Text mb={6} color="gray.600" textAlign="center">
        Help us build our database by submitting organizations you know!
      </Text>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          {/* Organization Name */}
          <FormControl isRequired>
            <FormLabel>Organization Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Youth Innovators Hub"
            />
          </FormControl>

          {/* Category & Format */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl isRequired>
              <FormLabel>Category</FormLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Select category"
              >
            {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Format</FormLabel>
              <Select
                name="format"
                value={formData.format}
                onChange={handleChange}
                placeholder="Select format"
              >
                <option value="Remote">Remote</option>
                <option value="In-Person">In-Person</option>
                <option value="Hybrid">Hybrid</option>
              </Select>
            </FormControl>
          </SimpleGrid>

          {/* Description */}
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the organization..."
              rows={3}
            />
          </FormControl>

          {/* Instagram */}
          <FormControl>
            <FormLabel>Instagram</FormLabel>
            <Input
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="@username"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Linktree (Optional)</FormLabel>
            <Input
              name="linktree"
              value={formData.linktree}
              onChange={handleChange}
              placeholder="https://linktr.ee/..."
            />
          </FormControl>

          <FormControl>
            <FormLabel>Tiktok (Optional)</FormLabel>
            <Input
              name="tiktok"
              value={formData.tiktok}
              onChange={handleChange}
              placeholder="@username"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Linkedin (Optional)</FormLabel>
            <Input
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://www.linkedin.com/..."
            />
          </FormControl>

          <FormControl>
            <FormLabel>Website (Optional)</FormLabel>
            <Input
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="website URL"
            />
          </FormControl>

          {/* Location */}
          <Heading size="sm" mt={2}>Location (Optional)</Heading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <FormControl>
              <FormLabel>City</FormLabel>
              <Input
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                placeholder="San Francisco"
              />
            </FormControl>

            <FormControl>
              <FormLabel>State/Province</FormLabel>
              <Input
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                placeholder="California"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Country</FormLabel>
              <Input
                name="location.country"
                value={formData.location.country}
                onChange={handleChange}
                placeholder="USA"
              />
            </FormControl>
          </SimpleGrid>

          <Button
            type="submit"
            w="full"
            size="lg"
            mt={4}
            bgGradient="linear(to-r, #E8B9AB, #D6EFFF)"
            color="white"
            _hover={{ bgGradient: "linear(to-r, #D6EFFF, #F4E285)" }}
            isLoading={isSubmitting}
          >
            Submit Organization
          </Button>
        </VStack>
      </form>
    </Box>
  );
}