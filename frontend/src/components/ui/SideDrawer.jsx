import { Box, Button, Image, Menu, Portal, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { Tooltip } from "./tooltip";
import logo from "../../assets/echoo.png";
import { LuSearch } from "react-icons/lu";
import { FaBell } from "react-icons/fa";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [value, setValue] = useState("asc");

  const items = [
    { label: "Ascending", value: "asc" },
    { label: "Descending", value: "desc" },
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
                  value={value}
                  onValueChange={(e) => setValue(e.value)}
                >
                  {items.map((item) => (
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
      </Box>
    </>
  );
}

export default SideDrawer;
