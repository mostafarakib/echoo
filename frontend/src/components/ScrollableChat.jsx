import React, { useEffect, useRef } from "react";
import { isLastMessage, isSameSender } from "../config/chatLogics";
import { ChatState } from "../context/ChatProvider";
import { Tooltip } from "./ui/tooltip";
import { Avatar } from "@chakra-ui/react";

function ScrollableChat({ messages }) {
  const { user } = ChatState();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      style={{
        overflowY: "auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {messages &&
        messages.map((message, index) => (
          <div
            key={message._id || index}
            style={{ marginBottom: "10px", display: "flex" }}
          >
            {(isSameSender(messages, message, index, user._id) ||
              isLastMessage(messages, index, user._id)) && (
              <Tooltip content={message.sender.name} showArrow>
                <Avatar.Root
                  size={"sm"}
                  marginTop={"7px"}
                  marginRight={1}
                  cursor={"pointer"}
                >
                  <Avatar.Fallback name={message.sender.name} />
                  <Avatar.Image src={message.sender.pic} />
                </Avatar.Root>
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  message.sender._id === user._id ? "#bee3f8" : "#b9f5d0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: message.sender._id === user._id ? "auto" : "0",
              }}
            >
              {message.content}
            </span>
          </div>
        ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ScrollableChat;
