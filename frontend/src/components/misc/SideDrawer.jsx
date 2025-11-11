import {
  Avatar,
  Box,
  Button,
  CloseButton,
  Drawer,
  Image,
  Input,
  Menu,
  Portal,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Tooltip } from "../ui/tooltip";
import logo from "../../assets/echoo.png";
import { LuSearch } from "react-icons/lu";
import { FaBell, FaChevronDown } from "react-icons/fa";
import { ChatState } from "../../context/ChatProvider";
import { dialog } from "../ui/dialog";
import { useNavigate } from "react-router";
import { toaster } from "../ui/create-toaster";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserListItem";
import ProfileDialog from "./ProfileDialog";
import { getSender } from "../../config/chatLogics";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [avatarValue, setAvatarValue] = useState("profile");
  const [openDrawer, setOpenDrawer] = useState(false);

  const navigate = useNavigate();

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
    socketRef,
  } = ChatState();

  const avatarItems = [
    { label: "MyProfile", value: "profile" },
    { label: "Log Out", value: "logout" },
  ];

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/", { replace: true });
  };

  const handleSearch = async () => {
    if (!search) {
      toaster.create({
        description: "Please enter something in search",
        type: "warning",
        closable: true,
      });
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toaster.create({
        title: "Error occured!",
        description: "Failed to load the search results",
        type: "error",
        closable: true,
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setLoading(false);
      setOpenDrawer(false);
    } catch (error) {
      toaster.create({
        title: "Error fetching the chats",
        description: error.message,
        type: "error",
        closable: true,
      });
    }
  };

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };

        const { data } = await axios.get("/api/notification", config);
        if (Array.isArray(data)) setNotifications(data);
        else if (data.unread) setNotifications(data.unread);
      } catch (error) {
        console.warn("loadNotifications err:", error.message || error);
      }
    };

    if (user) loadNotifications();
  }, []);

  const onCLickNotification = async (item) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/notification/mark-read",
        {
          chatId: item.chat._id,
        },
        config
      );

      if (data && data.unread) {
        setNotifications(data.unread);
      } else {
        setNotifications((prev) =>
          prev.filter((n) => n.chat._id !== item.chat._id)
        );
      }

      // open the chat
      setSelectedChat(item.chat);

      // ensure socket joins the chat room
      if (socketRef?.current && socketRef.current.connected) {
        socketRef.current.emit("join chat", item.chat._id);
      }
    } catch (error) {
      console.error("onClickNotification error:", error);
    }
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        backdropBlur={"5px"}
      >
        <Tooltip showArrow content="Search user to start chatting">
          <Button
            variant="ghost"
            onClick={(e) => setOpenDrawer((prev) => !prev)}
          >
            <LuSearch />
            <Text display={{ base: "none", md: "flex" }} px={"4"}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Image
          src={logo}
          height={{ base: "2.4rem", sm: "3rem" }}
          alt="echoo logo"
        />
        <div>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                variant={"plain"}
                size="sm"
                p={{ base: "1", sm: "2" }}
                m={"1"}
              >
                <FaBell />
                {notifications.length > 0 && (
                  <Text
                    fontSize="x-small"
                    position="absolute"
                    top="0"
                    right="0"
                    bg="red.500"
                    color="white"
                    borderRadius="full"
                    px={2}
                  >
                    {notifications.length}
                  </Text>
                )}
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content minW="10rem">
                  {notifications.length === 0 ? (
                    <Text px={"2"} py={"2"}>
                      No New Messages
                    </Text>
                  ) : (
                    notifications.map((item) => (
                      <Menu.Item
                        cursor={"pointer"}
                        key={item._id}
                        onClick={() => {
                          onCLickNotification(item);
                        }}
                      >
                        {item.chat.isGroupChat
                          ? `New Message in ${item.chat.chatName}`
                          : `New Message from ${getSender(
                              user,
                              item.chat.users
                            )}`}
                      </Menu.Item>
                    ))
                  )}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                variant={"plain"}
                size="sm"
                p={{ base: "1", sm: "2" }}
                m={"1"}
              >
                <Avatar.Root size={"sm"}>
                  <Avatar.Fallback name={user.name} />
                  <Avatar.Image src={user.pic} />
                </Avatar.Root>
                <FaChevronDown />
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content minW="10rem">
                  <Menu.RadioItemGroup
                    value={avatarValue}
                    onValueChange={(e) => {
                      setAvatarValue(e.value);
                      if (e.value === "profile") {
                        dialog.open("profile", {
                          title: user.name,
                          content: (
                            <ProfileDialog
                              user={user}
                              onClose={() => dialog.close("profile")}
                            />
                          ),
                        });
                      }
                      if (e.value === "logout") {
                        logoutHandler();
                      }
                    }}
                  >
                    {avatarItems.map((item) => (
                      <Menu.RadioItem
                        cursor={"pointer"}
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                        <Menu.ItemIndicator />
                      </Menu.RadioItem>
                    ))}
                  </Menu.RadioItemGroup>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </div>
      </Box>
      <dialog.Viewport />

      <Drawer.Root
        open={openDrawer}
        onOpenChange={(e) => setOpenDrawer(e.open)}
        placement={"start"}
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Search Users</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Box display={"flex"} pb={"2"}>
                  <Input
                    placeholder="Search by name or email"
                    mr={2}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button onClick={handleSearch}>Search</Button>
                </Box>
                {loading ? (
                  <ChatLoading />
                ) : (
                  searchResult?.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    />
                  ))
                )}
                {loadingChat && (
                  <Spinner marginLeft={"auto"} display={"flex"} />
                )}
              </Drawer.Body>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
}

export default SideDrawer;
