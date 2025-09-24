import { Button, HStack } from "@chakra-ui/react";
import React from "react";

function Homepage() {
  return (
    <div>
      <h1>hello</h1>
      <HStack>
        <Button variant="solid">Click me</Button>
        <Button color="teal">Click me</Button>
      </HStack>
    </div>
  );
}

export default Homepage;
