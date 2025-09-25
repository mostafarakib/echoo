import React from "react";
import { Box, Container, Text } from "@chakra-ui/react";
import Tabs from "../components/ui/tabs";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import echooLogo from "../assets/echoo.png";

function Homepage() {
  const tabs = [
    { label: "Login", value: "login", content: <Login /> },
    { label: "Sign Up", value: "signup", content: <Signup /> },
  ];
  return (
    <Container w={"lg"} centerContent>
      <Box
        justifyContent={"center"}
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        display={"flex"}
      >
        <img
          style={{ display: "block", height: "4.5rem" }}
          src={echooLogo}
          alt="logo"
        />

        {/* <Text
          textAlign={"center"}
          fontSize={"4xl"}
          fontFamily={"Work sans"}
          fontWeight={300}
        >
          
        </Text> */}
      </Box>
      <Box
        bg={"white"}
        w={"100%"}
        p={4}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Tabs tabs={tabs} />
      </Box>
    </Container>
  );
}

export default Homepage;
