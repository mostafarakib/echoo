import { Button, Field, Input, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { PasswordInput } from "../ui/password-input";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
  };
  return (
    <form style={{ width: "100%" }} onSubmit={submitHandler}>
      <VStack spaceY={"5px"}>
        {/* email  */}
        <Field.Root required>
          <Field.Label>
            Email <Field.RequiredIndicator />
          </Field.Label>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="me@example.com"
            variant="outline"
          />
        </Field.Root>
        {/* password  */}
        <Field.Root required>
          <Field.Label>
            Password <Field.RequiredIndicator />
          </Field.Label>
          <PasswordInput
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Your Password"
          />
        </Field.Root>

        {/* Login button */}
        <Button
          type="submit"
          colorScheme={"dark"}
          w={"100%"}
          style={{ marginTop: 15 }}
        >
          Sign Up
        </Button>
        {/* get guest user credentials button */}
        <Button
          type="submit"
          colorPalette={"red"}
          w={"100%"}
          style={{ marginTop: "5px" }}
        >
          Get Guest User Credentials
        </Button>
      </VStack>
    </form>
  );
}

export default Login;
