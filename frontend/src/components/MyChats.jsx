import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import { toaster } from "./ui/create-toaster";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { IoIosAdd } from "react-icons/io";
import ChatLoading from "./ChatLoading";
import { getSender } from "@/config/chatLogics";
import { dialog } from "./ui/dialog";
import CreateGroupDialog from "./misc/CreateGroupDialog";

function MyChats({ fetchAgain }) {
  const [loggedUser, setLoggedUser] = useState(null);
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: "Failed to fetch the chats",
        type: "error",
        closable: true,
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  const onGroupCreateClick = () => {
    dialog.open("groupCreate", {
      title: "Create a group",
      content: (
        <CreateGroupDialog onClose={() => dialog.close("groupCreate")} />
      ),
    });
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection={"column"}
      alignItems={"center"}
      padding={3}
      background={"white"}
      width={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        paddingBottom={3}
        paddingInline={3}
        fontSize={{ base: "24px", md: "27px" }}
        fontFamily={"Work sans"}
        display={"flex"}
        width={"100%"}
        justifyContent={"right"}
        alignItems={"center"}
      >
        <Button
          display={"flex"}
          fontSize={{ base: "17px", md: "10px", lg: "15px" }}
          onClick={() => onGroupCreateClick()}
        >
          New Group Chat <IoIosAdd />
        </Button>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        padding={3}
        background={"#f8f8f8"}
        width={"100%"}
        height={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor={"pointer"}
                background={selectedChat === chat ? "#38b2ac" : "#e8e8e8"}
                color={selectedChat === chat ? "white" : "black"}
                paddingX={3}
                paddingY={2}
                borderRadius={"lg"}
                key={chat._id}
              >
                <Text fontWeight={"bold"}>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                <Text fontSize={"small"}>
                  {chat.latestMessage &&
                    `${
                      chat.latestMessage.sender.name &&
                      chat.latestMessage.sender._id === user._id
                        ? "You"
                        : chat.latestMessage.sender.name.split(" ")[0]
                    }: ${
                      chat.latestMessage.content.length > 30
                        ? chat.latestMessage.content.substring(0, 31) + "..."
                        : chat.latestMessage.content
                    }`}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}

export default MyChats;
