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
import { toaster } from "../ui/create-toaster";
import axios from "axios";
import { useNavigate } from "react-router";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const postDetails = async (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toaster.create({
        description: "Please Select an Image!",
        type: "warning",
        closable: true,
      });
      setLoading(false);
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "echoo-messenger");
      data.append("cloud_name", "ddeole3il");
      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/ddeole3il/image/upload",
          { method: "POST", body: data }
        );

        const result = await response.json();
        console.log(result);

        if (response.ok) {
          setPic(result.secure_url.toString());
          toaster.create({
            description: "Image uploaded successfully!",
            type: "success",
            closable: true,
          });
        } else {
          toaster.create({
            description: "Failed to upload image. Please try again.",
            type: "error",
            closable: true,
          });
        }
      } catch (error) {
        console.log(error);
        toaster.create({
          description: "Failed to upload image. Please try again.",
          type: "error",
          closable: true,
        });
      } finally {
        setLoading(false);
      }
    } else {
      toaster.create({
        description: "Please select a JPEG or PNG image!",
        type: "warning",
        closable: true,
      });
      setLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      toaster.create({
        description: "Please Fill all the Fields",
        type: "warning",
        closable: true,
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toaster.create({
        description: "Passwords Do Not Match",
        type: "warning",
        closable: true,
      });

      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: "Content-type: application/json",
      };

      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );

      toaster.create({
        description: "Registration Successful",
        type: "success",
        closable: true,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      console.log(error);
      toaster.create({
        title: "Error Occurred!",
        description: error.response.data.message,
        type: "error",
        closable: true,
      });
    } finally {
      setLoading(false);
      navigate("/chats");
    }
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
            autoComplete="off"
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
          loading={loading}
        >
          Sign Up
        </Button>
      </VStack>
    </form>
  );
}

export default Signup;
