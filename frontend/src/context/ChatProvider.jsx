import axios from "axios";
import { useState, useEffect, useContext, createContext, useRef } from "react";
import { useNavigate } from "react-router";
import { io } from "socket.io-client";

const ChatContext = createContext();
const ENDPOINT =
  import.meta.env.NODE_ENV === "production"
    ? window.location.origin
    : "http://localhost:5000";

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  const socketRef = useRef(null);

  useEffect(() => {
    let parsedUserInfo = null;

    try {
      parsedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    } catch (error) {
      console.error("Error parsing user info from localStorage:", error);
    }

    setUser(parsedUserInfo);

    if (!parsedUserInfo) {
      navigate("/", { replace: true });
      return;
    }

    socketRef.current = io(ENDPOINT, { transports: ["websocket"] });
    socketRef.current.emit("setup", parsedUserInfo);
    socketRef.current.on("connected", () => {
      console.log("socket connected (ChatProvider)");
    });

    socketRef.current.on("notification", (payload) => {
      setNotifications((prev) => {
        if (!payload || !payload._id) return prev;

        // Find if we already have a notification from this same sender (and chat)
        const existingIndex = prev.findIndex(
          (n) =>
            n.sender?._id === payload.sender?._id &&
            n.chat?._id === payload.chat?._id
        );

        // If this notification is meant to replace an older one
        if (payload.type === "replace" && existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = payload;
          return updated;
        }

        // If there's no existing notification from this sender/chat, add it
        if (existingIndex === -1) {
          return [payload, ...prev];
        }

        // Otherwise, ignore duplicate
        return prev;
      });
    });

    const loadNotifications = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${parsedUserInfo.token}` },
        };
        const { data } = await axios.get("/api/notification", config);
        // controller returns unread by default
        if (Array.isArray(data)) setNotifications(data);
        else if (Array.isArray(data.unread)) setNotifications(data.unread);
      } catch (err) {
        console.warn("Failed to load notifications:", err.message || err);
      }
    };

    loadNotifications();
    return () => {
      if (socketRef.current) {
        socketRef.current.off("connected");
        socketRef.current.off("notification");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notifications,
        setNotifications,
        socketRef,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
