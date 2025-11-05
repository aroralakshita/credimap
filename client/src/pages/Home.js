import { Box, Button, Flex, Heading, Text, HStack, VStack, SimpleGrid } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";



export default function Home() {
  const navigate = useNavigate();
  return (
    <Layout>
        <Box
    bgGradient="linear(to-tr, #E8B9AB, #D6EFFF, #F4E285)" // vertical gradient ending in yellow
    minH="100vh"
  >
      {/* Hero Section */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        textAlign="center"
        py={24}
        px={6}
        color="255"
      >
        <Heading fontSize={{ base: "4xl", md: "5xl" }} fontWeight="bold">
          Verified by Students. Trusted Everywhere.
        </Heading>
        <Text mt={4} fontSize={{ base: "md", md: "lg" }} maxW="3xl" opacity={0.85}>
          Every review comes from a verified student, so you know what’s credible, not just clickable.
        </Text>

        {/*<HStack spacing={4} mt={8}>
          <Button
            size="lg"
            bg="#D6EFFF"
            color="#333"
            _hover={{ bg: "#BEE3F8" }}
          >
            Explore Map
          </Button>
          <Button
            size="lg"
            bg="#E8B9AB"
            color="#fff"
            _hover={{ bg: "#F2AFA0" }}
          >
            Get Started
          </Button>
        </HStack>*/}
      </Flex>

      {/* Features Section */}
      <Box py={0} px={6} maxW="7xl" mx="auto" mt={-10}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {[
            { title: "Share Your Experience", desc: "Your insights help others make smarter choices.", onClick: () => navigate(`/auth`)},
            { title: "Explore Map", desc: "Discover opportunities tailored to your interests and location.", onClick: () => navigate(`/orgmap`) },
            { title: "Get Started", desc: "Showcase your organization and grow your impact.", onClick: () => navigate(`/auth`) },
            //{ title: "⭐ Reviews", desc: "See student reviews & ratings of nonprofits." },
            //{ title: "📊 Dashboard", desc: "Manage org profiles & track reviews easily." },

            
          ].map((feature, idx) => (
            <Box
              key={idx}
              p={6}
              bg="white"
              rounded="2xl"
              shadow="xl"
              _hover={{ shadow: "2xl", transform: "translateY(-5px)", transition: "all 0.3s" }}
                onClick={feature.onClick}
  cursor={feature.onClick ? "pointer" : "default"}
            >
              <Heading fontSize="xl" mb={2} color="#E8B9AB">
                {feature.title}
              </Heading>
              <Text fontSize="md" color="#555">
                {feature.desc}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
      </Box>
    </Layout>
  );
}
