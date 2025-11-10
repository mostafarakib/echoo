import axios from "axios";
import { useState, useEffect, useContext, createContext, useRef } from "react";
import { useNavigate } from "react-router";
import { io } from "socket.io-client";

const ChatContext = createContext();
const ENDPOINT = "http://localhost:5000";

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

        if (prev.find((n) => n._id === payload._id)) return prev;

        return [...prev, payload];
      });
    });

    const loadNotifications = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${parsedUserInfo.token}` },
        };
        const { data } = await axios.get("/api/notification", config);
        // controller returns unread by default; handle both shapes
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

  console.log(notifications);
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
