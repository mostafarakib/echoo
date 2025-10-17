import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Box, Button, Input } from "@chakra-ui/react";
import SelectedUser from "../SelectedUser";
import UserListItem from "../UserListItem";
import axios from "axios";
import { toaster } from "../ui/create-toaster";

function UpdateGroupInfoDialog({ fetchAgain, setFetchAgain, fetchMessages }) {
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [renameLoading, setRenameLoading] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();

  const [displayName, setDisplayName] = useState(selectedChat.chatName);

  const handleRemove = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      toaster.create({
        title: "Only admin can remove someone from the group",
        type: "error",
        closable: true,
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );

      userToRemove._id === user._id
        ? setSelectedChat(null)
        : setSelectedChat(data);

      setFetchAgain(!fetchAgain);
      fetchMessages();
    } catch (error) {
      toaster.create({
        title: "Failed to remove user from the group",
        description: error.message,
        type: "error",
        closable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupName) {
      return;
    }

    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupName,
        },
        config
      );

      setSelectedChat(data);
      setDisplayName(data.chatName);
    } catch (error) {
      toaster.create({
        title: "Failed to rename",
        description: error.message,
        type: "error",
        closable: true,
      });
    } finally {
      setRenameLoading(false);
      setGroupName("");
    }
  };

  const handleUserSearch = async (query) => {
    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      toaster.create({
        title: "Error Occured!",
        description: "Failed to load the searched users",
        type: "error",
        closable: true,
      });
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((user) => user._id === userToAdd._id)) {
      toaster.create({
        title: "User already added in the group",
        type: "warning",
        closable: true,
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toaster.create({
        title: "Only admin can add someone to the group",
        type: "warning",
        closable: true,
      });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toaster.create({
        title: "Failed to add user to the group",
        description: error.message,
        type: "error",
        closable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Box textAlign={"center"} mb={3} fontSize="lg" fontWeight="bold">
        {displayName}
      </Box>
      {selectedChat.users.map((user) => (
        <SelectedUser
          key={user._id}
          user={user}
          handleFunction={() => handleRemove(user)}
        />
      ))}
      <Box
        as={"form"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        // onSubmit={handleSubmit}
      >
        <Box display={"flex"} width={"100%"}>
          <Input
            placeholder="Group Name"
            marginBottom={"3"}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <Button
            variant={"solid"}
            bg={"teal"}
            color={"white"}
            ml={1}
            isloading={renameLoading}
            onClick={handleRename}
          >
            Update
          </Button>
        </Box>
        <Input
          placeholder="Add users eg: Farhan, Rakib, John"
          marginBottom={"2"}
          // value={search}
          onChange={(e) => handleUserSearch(e.target.value)}
        />

        {/* // render searched users here */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          searchResult
            ?.slice(0, 4)
            .map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleAddUser(user)}
              />
            ))
        )}
        <Button
          bg={"red"}
          color={"white"}
          alignSelf={"flex-end"}
          //  onClick={handleRemove(user)}
        >
          Leave Group
        </Button>
      </Box>
    </Box>
  );
}

export default UpdateGroupInfoDialog;
