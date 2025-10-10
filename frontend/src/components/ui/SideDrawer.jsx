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
import React, { useState } from "react";
import { Tooltip } from "./tooltip";
import logo from "../../assets/echoo.png";
import { LuSearch } from "react-icons/lu";
import { FaBell, FaChevronDown } from "react-icons/fa";
import { ChatState } from "../../context/ChatProvider";
import { dialog } from "./dialog";
import { useNavigate } from "react-router";
import { toaster } from "./create-toaster";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [notificationValue, setNotificationValue] = useState("asc");
  const [avatarValue, setAvatarValue] = useState("profile");
  const [openDrawer, setOpenDrawer] = useState(false);

  const navigate = useNavigate();

  const { user, setSelectedChat, chats, setChats } = ChatState();

  const notificationItems = [
    { label: "Ascending", value: "asc" },
    { label: "Descending", value: "desc" },
  ];
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

        <Image src={logo} height={"3rem"} alt="echoo logo" />
        <div>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant={"plain"} size="sm" p={"2"} m={"1"}>
                <FaBell />
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content minW="10rem">
                  <Menu.RadioItemGroup
                    value={notificationValue}
                    onValueChange={(e) => notificationValue(e.value)}
                  >
                    {notificationItems.map((item) => (
                      <Menu.RadioItem key={item.value} value={item.value}>
                        {item.label}
                        <Menu.ItemIndicator />
                      </Menu.RadioItem>
                    ))}
                  </Menu.RadioItemGroup>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant={"plain"} size="sm" p={"2"} m={"1"}>
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
                        dialog.open("a", {
                          title: user.name,
                          content: (
                            <Box
                              textAlign="center"
                              display="flex"
                              flexDirection="column"
                              minH="100%"
                              alignItems={"center"}
                            >
                              <Image
                                src={user.pic}
                                borderRadius={"full"}
                                alt={user.name}
                                boxSize={"150px"}
                              />
                              <Text mt={"4"}>Email: {user.email}</Text>

                              <Button
                                alignSelf={"flex-end"}
                                onClick={() => dialog.close("a")}
                              >
                                Close
                              </Button>
                            </Box>
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
