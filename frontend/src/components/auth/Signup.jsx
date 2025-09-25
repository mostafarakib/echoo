import {
  Button,
  Field,
  FileUpload,
  FileUploadList,
  Input,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { PasswordInput } from "../ui/password-input";
import { LuFileImage } from "react-icons/lu";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");

  const postDetails = (pics) => {};

  const submitHandler = (e) => {
    e.preventDefault();
  };
  return (
    <form style={{ width: "100%" }} onSubmit={submitHandler}>
      <VStack spaceY={"5px"}>
        {/* name  */}
        <Field.Root required>
          <Field.Label>
            Name <Field.RequiredIndicator />
          </Field.Label>
          <Input
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Your Name"
            variant="outline"
          />
        </Field.Root>
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
        {/* confirm password  */}
        <Field.Root required>
          <Field.Label>
            Confirm Password <Field.RequiredIndicator />
          </Field.Label>
          <PasswordInput
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Enter Your Password Again"
          />
        </Field.Root>
        {/* pic  */}
        <Field.Root>
          <Field.Label>Upload Your Picture</Field.Label>

          <FileUpload.Root
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
          >
            <FileUpload.HiddenInput />
            <FileUpload.Trigger asChild>
              <Button variant="outline" w={"100%"} justifyContent="flex-start">
                <LuFileImage /> Upload Images
              </Button>
            </FileUpload.Trigger>
            <FileUploadList />
          </FileUpload.Root>
        </Field.Root>

        {/* signup button */}
        <Button
          type="submit"
          colorScheme={"dark"}
          w={"100%"}
          style={{ marginTop: 15 }}
        >
          Sign Up
        </Button>
      </VStack>
    </form>
  );
}

export default Signup;
