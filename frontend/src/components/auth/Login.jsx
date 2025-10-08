import { Button, Field, Input, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { PasswordInput } from "../ui/password-input";
import { toaster } from "../ui/create-toaster";
import axios from "axios";
import { useNavigate } from "react-router";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toaster.create({
        description: "Please Fill all the Fields",
        type: "warning",
        closable: true,
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const data = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toaster.create({
        description: "Login Successful",
        type: "success",
        closable: true,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toaster.create({
        title: "Error Occurred!",
        description: error.response.data.message,
        type: "error",
        closable: true,
      });
    } finally {
      setLoading(false);
    }
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
            autoComplete="off"
            value={email}
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
            autoComplete="new-password"
            value={password}
          />
        </Field.Root>

        {/* Login button */}
        <Button
          type="submit"
          colorScheme={"dark"}
          w={"100%"}
          style={{ marginTop: 15 }}
          loading={loading}
        >
          Login
        </Button>
        {/* get guest user credentials button */}
        <Button
          onClick={() => {
            setEmail("guest@gmail.com");
            setPassword("guestuser@321");
          }}
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
