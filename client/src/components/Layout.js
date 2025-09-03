import { Box, Flex, Heading, Spacer, Button, HStack, VStack, Text, Container } from "@chakra-ui/react";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <Flex direction="column" minH="100vh" fontFamily="Ubuntu, sans-serif">
      {/* Navbar */}


      {/* Main Content */}
      <Box flex="1" w="full">
        {children}
      </Box>

      {/* Footer */}
      <Box textAlign="center" py={6} mt={8} color="34">
        <Text fontSize="sm">
          © {new Date().getFullYear()} Nonprofit Review. All rights reserved.
        </Text>
      </Box>
    </Flex>
  );
}
