import React from "react";
import { Button, ButtonGroup, Flex } from "@chakra-ui/react";

const AuthToggle = ({ isRegistering, setIsRegistering }) => (
  <Flex justify="center" mb={4}>
    <ButtonGroup isAttached>
      <Button
        colorScheme={!isRegistering ? "teal" : "gray"}
        variant={!isRegistering ? "solid" : "outline"}
        onClick={() => setIsRegistering(false)}
      >
        Sign In
      </Button>
      <Button
        colorScheme={isRegistering ? "teal" : "gray"}
        variant={isRegistering ? "solid" : "outline"}
        onClick={() => setIsRegistering(true)}
      >
        Sign Up
      </Button>
    </ButtonGroup>
  </Flex>
);

export default AuthToggle;