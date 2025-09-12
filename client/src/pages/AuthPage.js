import React, { useState } from "react";
import { Flex, Box } from "@chakra-ui/react";
import AuthToggle from "../components/AuthToggle";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const AuthPage = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <Flex
      w="100vw"
      h="100vh"
      align="center"
      justify="center"
      fontFamily="Ubuntu, sans-serif"
      bgGradient="linear(to-tr, #E8B9AB, #D6EFFF, #F4E285)"
      p={6}
    > 
    <div style={{ maxWidth: 400, margin: "auto", padding: "2rem" }}>
      <AuthToggle isRegistering={isRegistering} setIsRegistering={setIsRegistering} />
      {isRegistering ? (
        <RegisterForm />
      ) : (
        <LoginForm onLogin={onLogin} />
      )}
    </div>
    </Flex>
  );
};

export default AuthPage;