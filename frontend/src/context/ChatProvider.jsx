import { useState, useEffect, useContext, createContext } from "react";
import { useNavigate } from "react-router";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
    }
  }, [navigate]);
  return (
    <ChatContext.Provider value={{ user, setUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
