import React, { useEffect, useRef, useState } from "react";
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
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:5000";

function SingleChat() {
  const [fetchAgain, setFetchAgain] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();

  // refs to hold persistent values across renders
  const socketRef = useRef(null);
  const selectedChatRef = useRef(null);
  const joinRetryRef = useRef(null);

  const typingRef = useRef(false);
  const lastTypingTimeRef = useRef(null);
  const typingTimerRef = useRef(null);

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

      setMessages(data);
      setLoading(false);

      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("join chat", selectedChat._id);
      } else {
        // retry join until socket connects
        if (joinRetryRef.current) clearInterval(joinRetryRef.current);
        joinRetryRef.current = setInterval(() => {
          if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit("join chat", selectedChat._id);
            clearInterval(joinRetryRef.current);
            joinRetryRef.current = null;
          }
        }, 200);
      }
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
    socketRef.current = io(ENDPOINT, {
      transports: ["websocket"],
    });

    if (socketRef.current && user) {
      socketRef.current.emit("setup", user);
    }
    socketRef.current.on("connected", () => setSocketConnected(true));

    const handleMessageReceived = (newMessageReceived) => {
      // if this message belongs to currently open chat, append, else show notification
      const current = selectedChatRef.current;
      if (!current || current._id !== newMessageReceived.chat._id) {
        // notification logic
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
      }
    };

    socketRef.current.on("message received", handleMessageReceived);

    socketRef.current.on("typing", () => setIsTyping(true));
    socketRef.current.on("stop typing", () => setIsTyping(false));

    // cleanup on unmount
    return () => {
      if (joinRetryRef.current) {
        clearInterval(joinRetryRef.current);
        joinRetryRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.off("connected");
        socketRef.current.off("message received", handleMessageReceived);
        socketRef.current.off("typing");
        socketRef.current.off("stop typing");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
    fetchMessages();
  }, [selectedChat]);

  const sendMessage = async (event) => {
    event.preventDefault();

    if (!newMessage) return;

    socketRef.current.emit("stop typing", selectedChat._id);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const messageToSend = newMessage;
      setNewMessage("");

      const { data } = await axios.post(
        "/api/message",
        {
          content: messageToSend,
          chatId: selectedChat._id,
        },
        config
      );

      setMessages((prev) => {
        if (prev.find((m) => m._id === data._id)) return prev;
        return [...prev, data];
      });

      const payload = {
        ...data,
        chat:
          data.chat && data.chat.users ? data.chat : selectedChatRef.current,
      };
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("new message", payload);
      } else {
        console.warn("socket not ready; message emitted only locally");
      }
    } catch (error) {
      toaster.create({
        title: "Failed to send the message",
        description: error.message,
        type: "error",
        closable: true,
      });
    }
  };

  const TYPING_TIMER_LENGTH = 3000; // ms

  const typingHandler = (event) => {
    setNewMessage(event.target.value);

    if (!socketRef.current || !socketConnected) return;

    if (!typingRef.current) {
      typingRef.current = true;
      socketRef.current.emit("typing", selectedChatRef.current._id);
    }

    lastTypingTimeRef.current = new Date().getTime();

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

    typingTimerRef.current = setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - (lastTypingTimeRef.current || 0);

      if (timeDiff >= TYPING_TIMER_LENGTH && typingRef.current) {
        socketRef.current.emit("stop typing", selectedChatRef.current._id);
        typingRef.current = false;
      }
    }, TYPING_TIMER_LENGTH);
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
                {selectedChat?.users
                  .find((u) => u._id !== user._id)
                  .name.toUpperCase()}
                <IconButton
                  variant={"surface"}
                  marginLeft={"auto"}
                  onClick={() =>
                    dialog.open("viewSender", {
                      title: selectedChat.users
                        .find((u) => u._id !== user._id)
                        .name.toUpperCase(),
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
              {isTyping && (
                <Box
                  background={"white"}
                  display="inline-flex"
                  alignItems="center"
                  borderRadius="xl"
                  px={2.5}
                  py={2.5}
                  mb={2}
                >
                  <Box display="flex" gap={1}>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </Box>
                </Box>
              )}
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
