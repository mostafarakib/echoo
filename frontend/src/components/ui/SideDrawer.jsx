import {
  Avatar,
  Box,
  Button,
  Image,
  Menu,
  Portal,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Tooltip } from "./tooltip";
import logo from "../../assets/echoo.png";
import { LuSearch } from "react-icons/lu";
import { FaBell, FaChevronDown } from "react-icons/fa";
import { ChatState } from "../../context/ChatProvider";
import { dialog } from "./dialog";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [notificationValue, setNotificationValue] = useState("asc");
  const [avatarValue, setAvatarValue] = useState("profile");

  const { user } = ChatState();

  const notificationItems = [
    { label: "Ascending", value: "asc" },
    { label: "Descending", value: "desc" },
  ];
  const avatarItems = [
    { label: "MyProfile", value: "profile" },
    { label: "Log Out", value: "logout" },
  ];
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
          <Button variant="ghost">
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
                            >
                              <Box flex="1">
                                <Avatar.Root size="2xl" mb={4}>
                                  <Avatar.Fallback name={user.name} />
                                  <Avatar.Image src={user.pic} />
                                </Avatar.Root>

                                <Text>Email: {user.email}</Text>
                              </Box>

                              <Box textAlign="right" mt="4">
                                <Button onClick={() => dialog.close("a")}>
                                  Close
                                </Button>
                              </Box>
                            </Box>
                          ),
                        });
                      }
                    }}
                  >
                    {avatarItems.map((item) => (
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
        </div>
      </Box>
      <dialog.Viewport />
    </>
  );
}

export default SideDrawer;
