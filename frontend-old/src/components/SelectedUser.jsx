import { Box } from "@chakra-ui/react";
import React from "react";
import { IoIosClose } from "react-icons/io";

function SelectedUser({ user, handleFunction }) {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      fontSize="12px"
      bg="purple.500"
      color="white"
      cursor="pointer"
      onClick={handleFunction}
      display="inline-flex"
      alignItems="center"
      gap={1}
      _hover={{
        bg: "purple.600",
      }}
    >
      {user.name}
      <IoIosClose size={16} />
    </Box>
  );
}

export default SelectedUser;
