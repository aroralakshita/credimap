import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, VStack, useToast} from "@chakra-ui/react";
import StepEmailPassword from "./RegisterSteps/StepEmailPassword";
import StepDetails from "./RegisterSteps/StepDetails";
import StepOrganization from "./RegisterSteps/StepOrganization";
import axios from "axios";

function RegisterForm() {
  const toast = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Clear org-specific fields if role is student
      if (name === "role" && value === "student") {
        updated.description = "";
        updated.category = "";
        updated.format = "";
      }
      return updated;
    });
  };

  // Handle next step, skip Step 2 for students
  const handleNext = () => {
    if (step === 1 && formData.role === "student") {
      setStep(3); // skip StepDetails
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step === 3 && formData.role === "student") {
      setStep(1); // skip StepDetails
    } else {
      setStep((prev) => prev - 1);
    }
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
    country: formData.country
  },
  // Only include these if role is NOT student
  ...(formData.role !== "student" && {
    category: formData.category,
    format: formData.format,
    description: formData.description
  })
};

      const res = await axios.post("/api/auth/register", payload);
      localStorage.setItem("token", res.data.token);
      toast({
        title: "Registered successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // redirect to correct dashboard
if (["nonprofit", "company", "youthorg"].includes(res.data.user.role)) {
  navigate("/dashboard");   // org dashboard
} else {
  navigate("/studentdashboard");  // student dashboard
}

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

const isStepValid = () => {
  if (step === 1) {
    return formData.role && formData.name && formData.email && formData.password;
  }
  if (step === 2 && formData.role !== "student") {
    return formData.description && formData.category && formData.format;
  }
  if (step === 3) {
    return formData.city && formData.country;
  }
  return false;
};


  return (
    <Box bg="white" p={10} rounded="3xl" shadow="2xl" w="full" maxW="md">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          {step === 1 && (
            <StepEmailPassword formData={formData} handleChange={handleChange} />
          )}

          {step === 2 && formData.role !== "student" && (
            <StepDetails formData={formData} handleChange={handleChange} />
          )}

          {step === 3 && <StepOrganization formData={formData} handleChange={handleChange} />}

          {step > 1 && (
            <Button type="button" onClick={handleBack}>
              Back
            </Button>
          )}

          {step < 3 && (
            <Button type="button" onClick={handleNext} isDisabled={!isStepValid()}>
              Next
            </Button>
          )}

          {step === 3 && (
            <Button type="submit" colorScheme="blue" isDisabled={!isStepValid()}>
              Register
            </Button>
          )}
        </VStack>
      </form>
    </Box>
  );
}

export default RegisterForm;
