import { Box, Button, Image, Text } from "@chakra-ui/react";
import React from "react";

function ProfileDialog({ user, onClose }) {
  return (
    <Box
      textAlign="center"
      display="flex"
      flexDirection="column"
      minH="100%"
      alignItems={"center"}
    >
      <Image
        src={user.pic}
        borderRadius={"full"}
        alt={user.name}
        boxSize={{ base: "100px", sm: "150px" }}
      />
      <Text mt={"4"} wordBreak="break-word">
        Email: {user.email}
      </Text>

      <Button alignSelf={"flex-end"} onClick={() => onClose()}>
        Close
      </Button>
    </Box>
  );
}

export default ProfileDialog;
