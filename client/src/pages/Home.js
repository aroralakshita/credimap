import { Box, Button, Flex, Heading, Text, HStack, VStack, SimpleGrid } from "@chakra-ui/react";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        textAlign="center"
        py={24}
        px={6}
        bgGradient="linear(to-tr, #E8B9AB, #D6EFFF, #F4E285)"
        color="0"
      >
        <Heading fontSize={{ base: "4xl", md: "5xl" }} fontWeight="bold">
          Find & Review Nonprofits
        </Heading>
        <Text mt={4} fontSize={{ base: "md", md: "lg" }} maxW="3xl" opacity={0.85}>
          Explore organizations, share experiences, and help students discover
          opportunities that matter.
        </Text>

        <HStack spacing={4} mt={8}>
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
        </HStack>
      </Flex>

      {/* Features Section */}
      <Box py={20} px={6} maxW="7xl" mx="auto">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {[
            { title: "⭐ Reviews", desc: "See student reviews & ratings of nonprofits." },
            { title: "🗺️ Map", desc: "Browse organizations across locations & categories." },
            { title: "📊 Dashboard", desc: "Manage org profiles & track reviews easily." },
          ].map((feature, idx) => (
            <Box
              key={idx}
              p={6}
              bg="white"
              rounded="2xl"
              shadow="xl"
              _hover={{ shadow: "2xl", transform: "translateY(-5px)", transition: "all 0.3s" }}
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
    </Layout>
  );
}
