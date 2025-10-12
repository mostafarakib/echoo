import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { IoMdArrowBack } from "react-icons/io";
import { getFUllSender, getSender } from "../config/chatLogics";
import ProfileDialog from "./misc/ProfileDialog";
import { dialog } from "./ui/dialog";
import { MdAssignmentInd } from "react-icons/md";
import UpdateGroupInfoDialog from "./misc/UpdateGroupInfoDialog";

function SingleChat() {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user, selectedChat, setSelectedChat } = ChatState();
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            width={"100%"}
            fontFamily={"Work sans"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={{ base: "space-between" }}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              onClick={() => setSelectedChat(null)}
              variant={"surface"}
            >
              <IoMdArrowBack />
            </IconButton>
            {!selectedChat.isGroupChat ? (
              <>
                <IconButton
                  variant={"surface"}
                  marginLeft={"auto"}
                  onClick={() =>
                    dialog.open("viewSender", {
                      title: "Create a group",
                      content: (
                        <ProfileDialog
                          user={getFUllSender(user, selectedChat.users)}
                          onClose={() => dialog.close("viewSender")}
                        />
                      ),
                    })
                  }
                >
                  <MdAssignmentInd />
                </IconButton>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <IconButton
                  variant={"surface"}
                  marginLeft={"auto"}
                  onClick={() =>
                    dialog.open("updateGroupInfo", {
                      content: (
                        <UpdateGroupInfoDialog
                          user={getFUllSender(user, selectedChat.users)}
                          onClose={() => dialog.close("updateGroupInfo")}
                          fetchAgain={fetchAgain}
                          setFetchAgain={setFetchAgain}
                        />
                      ),
                    })
                  }
                >
                  <MdAssignmentInd />
                </IconButton>
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#e8e8e8"}
            width={"100%"}
            height={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          ></Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          height={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
