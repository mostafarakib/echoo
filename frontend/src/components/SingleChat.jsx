import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, IconButton, Input, Spinner, Text } from "@chakra-ui/react";
import { IoMdArrowBack } from "react-icons/io";
import { getFUllSender, getSender } from "../config/chatLogics";
import ProfileDialog from "./misc/ProfileDialog";
import { dialog } from "./ui/dialog";
import { MdAssignmentInd } from "react-icons/md";
import UpdateGroupInfoDialog from "./misc/UpdateGroupInfoDialog";
import axios from "axios";
import { toaster } from "./ui/create-toaster";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";

function SingleChat() {
  const [fetchAgain, setFetchAgain] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const { user, selectedChat, setSelectedChat } = ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      console.log(messages);
      setMessages(data);
      setLoading(false);
    } catch (error) {
      toaster.create({
        title: "Failed to Load the Messages",
        description: error.message,
        type: "error",
        closable: true,
      });
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const sendMessage = async (event) => {
    event.preventDefault();

    if (newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        console.log(data);

        setMessages((prev) => [...prev, data]);
      } catch (error) {
        toaster.create({
          title: "Failed to send the message",
          description: error.message,
          type: "error",
          closable: true,
        });
      }
    }
  };
  const typingHandler = (event) => {
    setNewMessage(event.target.value);
  };
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
                {selectedChat?.users[1]?.name.toUpperCase()}
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
                          fetchMessages={fetchMessages}
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
          >
            {loading ? (
              <Spinner
                size={"xl"}
                height={"20"}
                width={"20"}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <Box as={"form"} onSubmit={sendMessage}>
              <Input
                variant={"outline"}
                placeholder="Enter a message..."
                background={"#e0e0e0"}
                onChange={typingHandler}
                value={newMessage}
              />
            </Box>
          </Box>
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
